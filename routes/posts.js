const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// CREATE POST
router.post("/", auth, async (req, res) => {
  try {
    if (!req.body.content) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    const post = await Post.create({
      content: req.body.content,
      author: req.user.username,
      userId: req.user.id
    });

    res.json(post);
  } catch (err) {
    console.error("POST CREATE ERROR:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("POST FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to load posts" });
  }
});

module.exports = router;
