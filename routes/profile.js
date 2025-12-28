const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Post = require("../models/Post");

/**
 * UPDATE PROFILE (USED BY EDIT PROFILE PAGE)
 * PUT /api/profile
 */
router.put("/", auth, async (req, res) => {
  try {
    const { name, department, year, about } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.department = department;
    user.year = year;
    user.about = about;

    await user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

/**
 * GET PROFILE BY USERNAME
 * GET /api/profile/:username
 */
router.get("/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postCount = await Post.countDocuments({
      author: user.username
    });

    res.json({
      username: user.username,
      about: user.about,
      friendsCount: user.friends.length,
      postCount
    });
  } catch (err) {
    console.error("PROFILE FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

module.exports = router;
