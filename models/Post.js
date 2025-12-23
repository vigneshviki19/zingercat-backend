const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

/**
 * GET USER PROFILE
 */
router.get("/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ POST COUNT (THIS IS THE KEY FIX)
    const postCount = await Post.countDocuments({
      author: user.username
    });

    // ✅ FRIEND COUNT (SAFE)
    const friendsCount = Array.isArray(user.friends)
      ? user.friends.length
      : 0;

    res.json({
      username: user.username,
      about: user.about || "",
      postCount,
      friendsCount
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile failed" });
  }
});

module.exports = router;
