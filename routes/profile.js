const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

/* Get user profile */
router.get("/:username", auth, async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ message: "User not found" });

  const postsCount = await Post.countDocuments({ author: user.username });

  res.json({
    username: user.username,
    about: user.about,
    friends: user.friends,
    friendsCount: user.friends.length,
    postsCount
  });
});

/* Update own profile */
router.put("/edit", auth, async (req, res) => {
  const { about } = req.body;

  await User.updateOne(
    { username: req.user.username },
    { about }
  );

  res.json({ message: "Profile updated" });
});

/* Search users */
router.get("/", auth, async (req, res) => {
  const q = req.query.q;
  const users = await User.find({
    username: { $regex: q, $options: "i" }
  }).select("username");

  res.json(users);
});

module.exports = router;
