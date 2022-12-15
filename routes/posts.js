const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const conn = mongoose.connection;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    console.log(err);
    return res.status(401).send("Invalid Token");
  }

  return next();
};

router.post("/", verifyToken, async function (req, res, next) {
  // this is slightly wrong, fix it later
  try {
    // load model from models\postModel.js
    const PostModel = require("../models/postModel");
    // create a new post
    let post = null;
    post = new PostModel({
      _id: new mongoose.Types.ObjectId(),
      email: req.emailDetected.email,
      title: req.body.title,
      description: req.body.description,
      liked_by: [],
      comments: [],
      post_id: req.body.post_id,
    });
    // save the post
    await conn.collection("posts").insertOne(post, function (err, result) {
      if (err) res.json(err);
      res.json(result);
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});
router.delete("/:id", verifyToken, async function (req, res, next) {
  try {
    // delete the post
    const post = await conn.collection("posts").findOne({
      post_id: req.params.id,
    });
    if (post.email != req.emailDetected.email) {
      return res.status(403).json({
        error: "Cannot delete others posts",
      });
    } else {
      await conn.collection("posts").deleteOne({
        post_id: req.params.id,
      });
    }
    // return the post
    res.json({
      message: "Post deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});
router.post("/like/:id", verifyToken, async function (req, res, next) {
  // change the implementation such that you will even store who liked it
  try {
    // add like for a post
    console.log(req.params.id, req.emailDetected.email);
    await conn.collection("posts").updateOne(
      {
        post_id: req.params.id,
      },
      {
        $push: {
          liked_by: req.emailDetected.email,
        },
      }
    );
    // return the post
    res.json({
      message: "Post liked",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});
router.post("/unlike/:id", verifyToken, async function (req, res, next) {
  try {
    // remove like for a post
    console.log(req.params.id, req.emailDetected.email);
    await conn.collection("posts").updateOne(
      {
        post_id: req.params.id,
      },
      {
        $pull: {
          liked_by: req.emailDetected.email,
        },
      }
    );
    // return the post
    res.json({
      message: "Post unliked",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});
router.post("/comment/:id", verifyToken, async function (req, res, next) {
  // implementation is wrong as of now, have to update it ensuring that comments are stored in a separate collectio
  try {
    // add like for a post
    console.log(req.params.id, req.emailDetected.email);
    await conn.collection("posts").updateOne(
      {
        post_id: req.params.id,
      },
      {
        $push: {
          comments: {
            email: req.emailDetected.email,
            content: req.body.content,
          },
        },
      }
    );
    // return the post
    res.json({
      message: "Comment Added",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});
router.get("/all_posts/", verifyToken, async function (req, res, next) {
  console.log("test");
  try {
    console.log(req.emailDetected.email);
    const posts = conn
      .collection("posts")
      .find({
        email: req.emailDetected.email,
      })
      .toArray(function (err, result) {
        if (err) throw err;
        // change the liked_by to return the length of the array
        result.forEach((post) => {
          post.liked_by = post.liked_by.length;
        });
        res.json(result);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});
router.get("/:id", async function (req, res, next) {
  console.log(req.params.id);
  try {
    // load model from models\postModel.js
    const PostModel = require("../models/postModel");
    // get the post
    const post = await conn.collection("posts").findOne({
      post_id: req.params.id,
    });
    // return the post
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;
