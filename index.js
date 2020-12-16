const user = require("./db/user").default;
const express = require("express");
const app = express();
const port = 3000;

app.get("/users", (req, res) => {
  user.getAll().then((users) => {
    res.send(users);
  });
});

app.post("/user", (req, res) => {
  console.log(req.body)
  res.send("good")
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
