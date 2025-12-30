const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Post = require("../models/Post");

/* =========================
   GET PROFILE
========================= */
router.get("/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) return res.status(404).json({ message: "User not found" });

    const postsCount = await Post.countDocuments({
      author: user.username
    });

    res.json({
      username: user.username,
      name: user.name,
      dept: user.dept,
      startYear: user.startYear,
      endYear: user.endYear,
      about: user.about,
      profilePic: user.profilePic,
      friends: user.friends,
      postsCount
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile load failed" });
  }
});

/* =========================
   UPDATE PROFILE
========================= */
router.put("/", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        dept: req.body.dept,
        startYear: Number(req.body.startYear),
        endYear: Number(req.body.endYear),
        about: req.body.about,
        profilePic: req.body.profilePic
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
});

module.exports = router;
