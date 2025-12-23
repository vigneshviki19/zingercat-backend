const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Send friend request
router.post("/request/:username", auth, async (req, res) => {
  const from = req.user.username;
  const to = req.params.username;

  if (from === to) return res.status(400).json({ message: "Cannot add yourself" });

  const target = await User.findOne({ username: to });
  if (!target) return res.status(404).json({ message: "User not found" });

  if (!target.friendRequests.includes(from)) {
    target.friendRequests.push(from);
    await target.save();
  }

  res.json({ message: "Friend request sent" });
});

// Accept friend request
router.post("/accept/:username", auth, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  const from = req.params.username;

  user.friendRequests = user.friendRequests.filter(u => u !== from);
  user.friends.push(from);

  const other = await User.findOne({ username: from });
  other.friends.push(user.username);

  await user.save();
  await other.save();

  res.json({ message: "Friend added" });
});

// Get friends list
router.get("/list", auth, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  res.json(user.friends);
});

// Get friend requests
router.get("/requests", auth, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  res.json(user.friendRequests);
});

module.exports = router;
