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

router.post("/posts", async function (req, res, next) {
  // this is slightly wrong, fix it later
  try {
    // load model from models\postModel.js
    const PostModel = require("../models/postModel");
    // create a new post
    let post = null;
    post = new PostModel({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      title: req.body.title,
      content: req.body.content,
    });
    // save the post
    await post.save();
    // return the post
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});
router.delete("/posts/:id", async function (req, res, next) {
  try {
    // load model from models\postModel.js
    const PostModel = require("../models/postModel");
    // delete the post
    await PostModel.deleteOne({ _id: req.params.id });
    // return the post
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});
router.post("/like/:id", async function (req, res, next) {
  // change the implementation such that you will even store who liked it
  try {
    // load model from models\postModel.js
    const PostModel = require("../models/postModel");
    // add like for a post
    await PostModel.updateOne(
      {
        _id: req.body.id,
      },
      {
        $inc: {
          likes: 1,
        },
      }
    );
    // return the post
    res.json({ message: "Post liked" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});
router.post("/unlike/:id", async function (req, res, next) {
  try {
    // load model from models\postModel.js
    const PostModel = require("../models/postModel");
    // remove like from a post
    await PostModel.updateOne(
      {
        _id: req.body.id,
      },
      {
        $inc: {
          likes: -1,
        },
      }
    );
    // return the post
    res.json({ message: "Post unliked" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});
router.post("/comment/:id", async function (req, res, next) {
  // implementation is wrong as of now, have to update it ensuring that comments are stored in a separate collection
  try {
    // load model from models\postModel.js
    const PostModel = require("../models/postModel");
    // add comment to a post
    await PostModel.updateOne(
      {
        _id: req.body.id,
      },
      {
        $push: {
          comments: {
            email: req.body.email,
            content: req.body.content,
          },
        },
      }
    );
    // return the post
    res.json({ message: "Comment added" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});
router.get("/posts/:id", async function (req, res, next) {
  try {
    // load model from models\postModel.js
    const PostModel = require("../models/postModel");
    // get the post
    const post = await PostModel.findOne({ _id: req.params.id });
    // return the post
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});
router.get("/all_posts", async function (req, res, next) {
  try {
    // load model from models\postModel.js
    const PostModel = require("../models/postModel");
    // get the post
    const posts = await PostModel.find();
    // return the post
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
