const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      default: ""
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
      type: [String], // store userIds
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
