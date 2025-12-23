const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/* ➕ SEND FRIEND REQUEST */
router.post("/request/:username", auth, async (req, res) => {
  const fromUser = await User.findById(req.user.id);
  const toUser = await User.findOne({ username: req.params.username });

  if (!toUser) return res.status(404).json({ message: "User not found" });
  if (toUser.friends.includes(fromUser._id))
    return res.json({ message: "Already friends" });

  if (!toUser.friendRequests.includes(fromUser._id)) {
    toUser.friendRequests.push(fromUser._id);
    await toUser.save();
  }

  res.json({ message: "Friend request sent" });
});

/* ✅ ACCEPT FRIEND REQUEST */
router.post("/accept/:username", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const other = await User.findOne({ username: req.params.username });

  if (!other) return res.status(404).json({ message: "User not found" });

  user.friendRequests = user.friendRequests.filter(
    (id) => id.toString() !== other._id.toString()
  );

  user.friends.push(other._id);
  other.friends.push(user._id);

  await user.save();
  await other.save();

  res.json({ message: "Friend added" });
});

/* 👥 GET FRIEND LIST */
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("friends", "username");
  res.json(user.friends);
});

/* 🔔 GET FRIEND REQUESTS */
router.get("/requests", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate(
    "friendRequests",
    "username"
  );
  res.json(user.friendRequests);
});

module.exports = router;
