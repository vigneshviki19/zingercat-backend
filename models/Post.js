const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    image: {
      type: String, // image URL
      default: ""
    },
    author: {
      type: String, // username
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
