const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// 🔍 Search users (Instagram style)
router.get("/", auth, async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);

  const users = await User.find({
    username: { $regex: q, $options: "i" }
  }).select("username about");

  res.json(users);
});

// 👤 Get user profile
router.get("/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate("friends", "username");

    if (!user) return res.status(404).json({ message: "User not found" });

    const postCount = await Post.countDocuments({ author: user.username });

    res.json({
      username: user.username,
      about: user.about || "",
      friendsCount: user.friends.length,
      postCount,
      friends: user.friends.map(f => f.username)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile error" });
  }
});

module.exports = router;
