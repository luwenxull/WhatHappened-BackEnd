const user = require("./db/user").default;
const express = require("express");
const fs = require("fs");
const https = require("https");
const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

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

app.post("/user", async (req, res) => {
  const { username, password } = req.body;
  const { length } = await user.find({ username });
  if (length) {
    res.status(409).send({ message: "The username is already in use" });
  } else {
    user.create({
      username,
      password,
    });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = await user.find({ username });
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
