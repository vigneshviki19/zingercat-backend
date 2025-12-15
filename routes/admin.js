const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");

const router = express.Router();

// Promote user to admin
router.post("/make-admin", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    res.status(400).json({ message: "Failed to promote user" });
  }
});

// Delete ANY post (admin power)
router.delete("/post/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post removed by admin" });
  } catch (err) {
    res.status(404).json({ message: "Post not found" });
  }
});

module.exports = router;
