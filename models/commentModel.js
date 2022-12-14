const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
  },
  postID: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamps: true,
});

const CommentModel = mongoose.model("user", CommentSchema);
module.exports = CommentModel;
