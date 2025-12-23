const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * SEARCH USERS
 * GET /api/profile/search?q=username
 */
router.get("/search", auth, async (req, res) => {
  try {
    const q = req.query.q || "";

    const users = await User.find({
      username: { $regex: q, $options: "i" }
    })
      .select("username")
      .limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
});

/**
 * GET USER PROFILE
 * GET /api/profile/:username
 */
router.get("/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("username about");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch {
    res.status(500).json({ message: "Profile fetch failed" });
  }
});

module.exports = router;
