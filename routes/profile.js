const express = require("express");
const router = express.Router();

const User = require("../models/User");
const PostModel = require("../models/Post"); // 👈 IMPORTANT NAME
const auth = require("../middleware/auth");

router.get("/:username", auth, async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 👇 DO NOT USE Post (name collision safe)
    const postCount = await PostModel.countDocuments({
      author: username
    });

    res.json({
      username: user.username,
      about: user.about || "",
      friendsCount: Array.isArray(user.friends) ? user.friends.length : 0,
      postCount
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

module.exports = router;
