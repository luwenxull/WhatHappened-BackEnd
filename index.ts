require('dotenv').config();

import * as db from './db';
import express, { Response } from 'express';
import fs from 'fs';
import https from 'https';

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  console.log(req.method, req.path, 'At time:', new Date().toLocaleString());
  next();
});

function usernameModifier(username: string | undefined) {
  return function (_: string) {
    return `${username}_${_}`;
  };
}

let unm = usernameModifier;

function handle<T>(p: Promise<T>, res: Response, message: String = '') {
  p.then((_) => {
    res.send({ message: 'OK', data: _ });
  }).catch((err) => {
    console.log(err);
    res.status(500).send({ message });
  });
}

const privateKey = fs.readFileSync('/root/.acme.sh/wxxfj.xyz/wxxfj.xyz.key', 'utf8');
const certificate = fs.readFileSync('/root/.acme.sh/wxxfj.xyz/wxxfj.xyz.cer', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const port = 3000;

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port);

async function checkIfUserExist(username: string | undefined, res: Response) {
  if (typeof username === 'undefined') return false;
  const users = await db.user.find({ username });
  if (users.length > 0) {
    return true;
  } else {
    res.status(401).send({ message: "Can't find related user" });
    return false;
  }
}

app.post('/user', async (req, res) => {
  const { username, password } = req.body;
  const { length } = await db.user.find({ username });
  if (length) {
    res.status(409).send({ message: '该用户名已被使用' });
  } else {
    db.user
      .create({
        username,
        password,
        filePath: String(Math.random()).slice(2),
      })
      .then(() => {
        res.send({ message: 'User created successfully' });
      });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = await db.user.find({ username });
  if (users.length) {
    if (users[0].password === password) {
      res.sendStatus(200);
    } else {
      res.status(401).send({ message: '密码错误' });
    }
  } else {
    res.status(401).send({ message: '用户未找到' });
  }
});

// 分组
app.get('/event', async (req, res) => {
  const username = req.header('username');
  const event = req.body;
  if (await checkIfUserExist(username, res)) {
    handle(db.event.find(event, unm(username)), res, '未找到对应事件');
  }
});

app.post('/event', async (req, res) => {
  const username = req.header('username');
  const event = req.body;
  if (await checkIfUserExist(username, res)) {
    handle(db.event.create(event, unm(username)), res, '创建事件失败');
  }
});

app.put('/event/:eventID', async (req, res) => {
  const username = req.header('username');
  const { eventID } = req.params;
  const event = req.body;
  if (await checkIfUserExist(username, res)) {
    handle(
      db.event.modify(
        {
          uuid: eventID,
        },
        event,
        unm(username)
      ),
      res,
      '更新事件失败'
    );
  }
});

app.delete('/event/:eventID', async (req, res) => {
  const username = req.header('username');
  const { eventID } = req.params;
  if (await checkIfUserExist(username, res)) {
    handle(db.event.remove({ uuid: eventID }, unm(username)), res, '移除事件失败');
  }
});

app.post('/backup', async (req, res) => {
  const username = req.header('username');
  const events = req.body;
  if (await checkIfUserExist(username, res)) {
    handle(
      Promise.all(
        events.map((event: any) => {
          return db.event
            .find(
              {
                uuid: event.uuid,
              },
              unm(username)
            )
            .then((_) => {
              if (_.length) {
                return db.event.modify(
                  {
                    uuid: event.uuid,
                  },
                  event,
                  unm(username)
                ) as any;
              } else {
                return db.event.create(event, unm(username)) as any;
              }
            });
        })
      ),
      res,
      '备份成功'
    );
  }
});
