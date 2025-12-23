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

    // ✅ SAFE COUNTS
    const postCount = await Post.countDocuments({
      username: user.username
    });

    const friendsCount = user.friends ? user.friends.length : 0;

    res.json({
      username: user.username,
      about: user.about || "",
      postCount,
      friendsCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile error" });
  }
});

module.exports = router;
