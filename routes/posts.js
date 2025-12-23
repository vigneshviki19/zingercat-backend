const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// ✅ DIRECT MODEL IMPORT (CORRECT WAY)
const Post = require("../models/Post");

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("POST FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to load posts" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
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

module.exports = router;
