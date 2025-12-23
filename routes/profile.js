const express = require("express");
const router = express.Router();

const User = require("../models/User");

// 🔥 force-load model correctly
const mongoose = require("mongoose");
const Post = mongoose.model("Post");

const auth = require("../middleware/auth");

router.get("/:username", auth, async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postCount = await Post.countDocuments({
      author: username
    });

    res.json({
      username: user.username,
      about: user.about || "",
      friendsCount: user.friends?.length || 0,
      postCount
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

module.exports = router;
