const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// Create a post (news / buy / sell / exchange / help)
router.post("/", async (req, res) => {
  const { title, description, category, price, createdBy } = req.body;

  try {
    const post = await Post.create({
      title,
      description,
      category,
      price,
      createdBy
    });

    res.json(post);
  } catch (err) {
    res.status(400).json({ message: "Failed to create post" });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Delete a post (used by admin later)
router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(404).json({ message: "Post not found" });
  }
});

module.exports = router;
