const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * GET USER PROFILE
 * /api/profile/:username
 */
router.get("/:username", auth, async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ SAFE defaults
    const friendsCount = Array.isArray(user.friends)
      ? user.friends.length
      : 0;

    const postsCount = await Post.countDocuments({
      author: username
    });

    res.json({
      username: user.username,
      about: user.about || "",
      friendsCount,
      postsCount
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

module.exports = router;
