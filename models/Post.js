const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ""
    },
    author: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    likes: {
      type: [String], // usernames who liked
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
