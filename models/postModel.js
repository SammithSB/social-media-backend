const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const PostSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    liked_by: {
      type: Array,
      required: true,
    },
    comments: {
      type: Array,
      required: true,
    },
    post_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("posts", PostSchema);
module.exports = PostModel;
