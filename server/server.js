// server.js
require("dotenv").config({ path: ".env" });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Chatkit = require("@pusher/chatkit-server");
const app = express();
const chatkit = new Chatkit.default({
  instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
  key: process.env.CHATKIT_SECRET_KEY
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//When a customer tries to contact support, we will request the
//name of the user which will be used as their userId.
//The userId is passed to the /users endpoint so that a new user
//account can be created on the Chatkit instance with the provided ID if it doesn’t exist already.

app.post("/users", (req, res) => {
  const { userId } = req.body;
  chatkit
    .createUser({
      id: userId,
      name: userId
    })
    .then(() => {
      res.sendStatus(201);
    })
    .catch(err => {
      if (err.error === "services/chatkit/user_already_exists") {
        console.log(`User already exists: ${userId}`);
        res.sendStatus(200);
      } else {
        res.status(err.status).json(err);
      }
    });
});

//The other route, /authenticate, is used to authenticate users who try to connect to your Chatkit instance.
//I’ve opted not to include an authentication flow in this example so that anyone who tries to contact a
//support agent would be granted access immediately.
app.post("/authenticate", (req, res) => {
  const authData = chatkit.authenticate({
    userId: req.query.user_id
  });
  res.status(authData.status).send(authData.body);
});

app.set("port", process.env.PORT || 5200);
const server = app.listen(app.get("port"), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
