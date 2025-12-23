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

    // find user
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // count posts
    const postCount = await Post.countDocuments({
      author: username
    });

    // safe counts
    const friendsCount = Array.isArray(user.friends)
      ? user.friends.length
      : 0;

    res.json({
      username: user.username,
      about: user.about || "",
      friendsCount,
      postCount,
      friends: user.friends || []
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

module.exports = router;
