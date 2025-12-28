const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema(
  {
    content: String,
    author: String,
    image: String,

    // 🔥 FEATURES YOU WANT
    likes: { type: [String], default: [] }, // usernames
    comments: { type: [commentSchema], default: [] },
    shares: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
