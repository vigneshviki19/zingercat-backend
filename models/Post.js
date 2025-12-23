const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: String,
    author: String,
    userId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
