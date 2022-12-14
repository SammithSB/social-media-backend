// reads in our .env file and makes those values available as environment variables
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");
const mongoose = require("mongoose");
const uri = process.env.MONGO_CONNECTION_URL;
if (!uri) {
  console.error(
    "MONGO_CONNECTION_URL is not defined in .env file.\nIf the error comes in github actions, no syntax errors detected"
  );
  process.exit(0);
}
mongoose.connect(uri);
mongoose.connection.on("error", (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on("connected", function () {
  console.log("connected to mongo");
});
// create an instance of an express app
const app = express();
// update express settings
var conn = mongoose.connection;

var user = {
  timestamp: Date.now(),
};

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// main routes

app.use("/users", users);
app.use("/posts", posts);
router.get("/", function (req, res) {
  res.send("Hello World!");
});
// have the server start listening on the provided port
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});

module.exports = app;
