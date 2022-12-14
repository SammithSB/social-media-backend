const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const conn = mongoose.connection;
const bcrypt = require("bcrypt");

async function verify_password(email, password) {
  // get the user from the database
  const user = await conn.collection("users").findOne({ email: email });
  // check the password
  if (user) {
    const compare = password === user.password;
    return compare;
  }
  return false;
}
// todo
async function verify_jwt() {}

router.get("/:id", async function (req, res, next) {
  conn
    .collection("users")
    .find({ _id: req.params.id })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});
// todo
router.post("/authenticate", async function (req, res, next) {
  // get the user from the database
  let user = await conn.collection(users.findOne({ email: req.body.email }));
  if (!user) {
    res.status(404);
    res.json({ status: "email not found" });
  }
  if (verify_password(req.body.email, req.body.password)) {
    res.status(200);
    res.json({ status: "ok" });
  } else {
    res.status(401);
    res.json({ status: "unauthorized" });
  }
});

router.post("/follow/:id", async function (req, res, next) {
  // this function is wrong, update it
  conn
    .collection("users")
    .find({ _id: req.params.id })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});
router.post("/unfollow/:id", async function (req, res, next) {
  // this function is wrong, update it
  conn
    .collection("users")
    .find({ _id: req.params.id })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

module.exports = router;
