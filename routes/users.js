const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const conn = mongoose.connection;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

async function verify_password(email, password) {
  // get the user from the database
  const user = await conn.collection("users").findOne({
    email: email,
  });
  // check the password
  if (user) {
    const compare = password === user.password;
    return compare;
  }
  return false;
}

const config = process.env;

const verifyToken = (req, res, next) => {
  // https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.emailDetected = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};
router.post("/register", async function (req, res, next) {
  try {
    // load model from models\userModel.js
    const UserModel = require("../models/userModel");
    // create a new user
    let user = null;
    console.log(user);
    user = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      posts: [],
      followers: [],
      following: [],
    });

    conn.collection("users").insertOne(user, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await conn.collection("users").findOne({
      email,
    });

    if (user && password == user.password) {
      // Create token
      const token = jwt.sign(
        {
          email,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "4h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

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
  let user = await conn.collection("users").findOne({
    email: req.body.email,
  });
  if (!user) {
    res.status(404);
    res.json({
      status: "email not found",
    });
  }
  if (verify_password(req.body.email, req.body.password)) {
    res.status(200);
    res.json({
      status: "ok",
    });
  } else {
    res.status(401);
    res.json({
      status: "unauthorized",
    });
  }
});

router.post("/follow/:id", verifyToken, async function (req, res, next) {
  // this function is wrong, update it
  console.log(req.emailDetected.email);
  conn
    .collection("users")
    .updateOne(
      { email: req.emailDetected.email },
      { $push: { following: req.params.id } },
      function (err, raw) {
        if (err) return handleError(err);
        console.log("The raw response from Mongo was ", raw);
      }
    );
  return res.json({ status: "ok" });
});
router.post("/unfollow/:id", verifyToken, async function (req, res, next) {
  // this function is wrong, update it
  console.log(req.emailDetected.email);
  conn
    .collection("users")
    .updateOne(
      { email: req.emailDetected.email },
      { $pull: { following: req.params.id } },
      function (err, raw) {
        if (err) return handleError(err);
        console.log("The raw response from Mongo was ", raw);
      }
    );
  return res.json({ status: "ok" });
});

module.exports = router;
