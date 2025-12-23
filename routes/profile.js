const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post"); // 🔥 FIXED
const auth = require("../middleware/auth");

router.get("/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ SAFE POST COUNT
    const postCount = await Post.countDocuments({
      author: user.username
    });

    res.json({
      username: user.username,
      about: user.about || "",
      postCount,
      friendsCount: user.friends?.length || 0
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile failed" });
  }
});

module.exports = router;
