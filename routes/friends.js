const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

/* =========================
   SEND FRIEND REQUEST
========================= */
router.post("/request/:username", auth, async (req, res) => {
  try {
    const sender = await User.findById(req.user.id);
    const receiver = await User.findOne({ username: req.params.username });

    if (!receiver)
      return res.status(404).json({ message: "User not found" });

    if (receiver.friends.includes(sender._id))
      return res.json({ message: "Already friends" });

    if (receiver.friendRequests.includes(sender._id))
      return res.json({ message: "Request already sent" });

    receiver.friendRequests.push(sender._id);
    await receiver.save();

    res.json({ message: "Friend request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Request failed" });
  }
});

/* =========================
   ACCEPT FRIEND REQUEST
========================= */
router.post("/accept/:userId", auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const other = await User.findById(req.params.userId);

    if (!me.friendRequests.includes(other._id))
      return res.status(400).json({ message: "No request found" });

    me.friendRequests = me.friendRequests.filter(
      (id) => id.toString() !== other._id.toString()
    );

    me.friends.push(other._id);
    other.friends.push(me._id);

    await me.save();
    await other.save();

    res.json({ message: "Friend added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Accept failed" });
  }
});

/* =========================
   GET FRIEND REQUESTS
========================= */
router.get("/requests", auth, async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate("friendRequests", "username profilePic");

  res.json(user.friendRequests);
});

/* =========================
   GET FRIENDS
========================= */
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate("friends", "username profilePic");

  res.json(user.friends);
});

module.exports = router;
