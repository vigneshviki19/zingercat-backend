const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

/* =========================
   SEARCH USERS
   ========================= */
router.get("/", auth, async (req, res) => {
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

/* =========================
   USER PROFILE
   ========================= */
router.get("/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const postsCount = await Post.countDocuments({ author: user.username });
    const friendsCount = user.friends?.length || 0;

    res.json({
      username: user.username,
      about: user.about || "",
      postsCount,
      friendsCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile failed" });
  }
});

module.exports = router;
