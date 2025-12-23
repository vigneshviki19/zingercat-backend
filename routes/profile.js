const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

/* 🔍 SEARCH USERS */
router.get("/search", auth, async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const users = await User.find({
      username: { $regex: q, $options: "i" }
    }).select("username about");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
});

/* 👤 GET USER PROFILE */
router.get("/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postsCount = await Post.countDocuments({
      author: user.username
    });

    res.json({
      username: user.username,
      about: user.about || "",
      friendsCount: user.friends.length,
      postsCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile fetch failed" });
  }
});

module.exports = router;
