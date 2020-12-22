import * as db from "./db";
import express, { Response } from "express";
import fs from "fs";
import https from "https";
const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  console.log(req.method, req.path, "At time:", new Date().toLocaleString());
  next();
});

function usernameModifier(username: string | undefined) {
  return function (_: string) {
    return `${username}_${_}`;
  };
}

let unm = usernameModifier;

function handle<T>(p: Promise<T>, res: Response, message: String = "") {
  p.then((_) => {
    // console.log(_);
    res.send({ message: "OK", data: _ });
  }).catch((err) => {
    console.log(err);
    res.status(500).send({ message });
  });
}

const privateKey = fs.readFileSync(
  "/root/.acme.sh/wxxfj.xyz/wxxfj.xyz.key",
  "utf8"
);
const certificate = fs.readFileSync(
  "/root/.acme.sh/wxxfj.xyz/wxxfj.xyz.cer",
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };
const port = 3000;

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port);

async function checkIfUserExist(username?: string) {
  if (typeof username === "undefined") return false;
  const users = await db.user.find({ username });
  return users.length > 0;
}

app.post("/user", async (req, res) => {
  const { username, password } = req.body;
  const { length } = await db.user.find({ username });
  if (length) {
    res.status(409).send({ message: "The username is already in use" });
  } else {
    db.user
      .create({
        username,
        password,
        filePath: String(Math.random()).slice(2),
      })
      .then(() => {
        res.send({ message: "User created successfully" });
      });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = await db.user.find({ username });
  if (users.length) {
    if (users[0].password === password) {
      res.sendStatus(200);
    } else {
      res.status(403).send({ message: "Wrong password" });
    }
  } else {
    res.status(403).send({ message: "The user was not found" });
  }
});

// 分组
app.get("/group", async (req, res) => {
  const username = req.header("username");
  const group = req.body;
  if (await checkIfUserExist(username)) {
    handle(db.group.find(group, unm(username)), res, "Failed to find group");
  }
});

app.post("/group", async (req, res) => {
  const username = req.header("username");
  const group = req.body;
  if (await checkIfUserExist(username)) {
    handle(
      db.group.create(group, unm(username)),
      res,
      "Failed to create group"
    );
  }
});

app.delete("/group/:groupID", async (req, res) => {
  const username = req.header("username");
  const groupID = req.params.groupID;
  if (await checkIfUserExist(username)) {
    handle(
      db.group.remove({ uuid: groupID }, unm(username)).then((_) => {
        return db.groupTime.remove({ groupID }, unm(username));
      }),
      res,
      "Failed to remove group"
    );
  }
});

// 记录
app.get("/group/:groupID/time", async (req, res) => {
  const username = req.header("username");
  const groupID = req.params.groupID;
  // const time = req.body;
  if (await checkIfUserExist(username)) {
    handle(
      db.groupTime.find({ groupID }, unm(username)),
      res,
      "Failed to find group time"
    );
  }
});

app.post("/group/:groupID/time", async (req, res) => {
  const username = req.header("username");
  const groupID = req.params.groupID;
  const time = req.body;
  if (await checkIfUserExist(username)) {
    handle(
      db.groupTime.create(
        {
          ...time,
          groupID,
        },
        unm(username)
      ),
      res,
      "Failed to create group time"
    );
  }
});

app.delete("/group/time/:timeID", async (req, res) => {
  const username = req.header("username");
  const timeID = req.params.timeID;
  const time = req.body;
  if (await checkIfUserExist(username)) {
    handle(
      db.groupTime.remove({}, unm(username)),
      res,
      "Failed to remove group time"
    );
  }
});
