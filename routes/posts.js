const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * CREATE POST
 */
router.post("/", auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Post is empty" });
    }

    const post = await Post.create({
      content,
      author: req.user.username,
      userId: req.user.id
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Post creation failed" });
  }
});

/**
 * GET ALL POSTS
 */
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

module.exports = router;
