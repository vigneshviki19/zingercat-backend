const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Post = require("../models/Post");

/* =========================
   🔍 SEARCH USERS
   GET /api/profile?q=username
   (🔥 MUST BE FIRST)
========================= */
router.get("/", auth, async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) return res.json([]);

    const users = await User.find({
      username: { $regex: q, $options: "i" }
    })
      .select("username about profilePic")
      .limit(10);

    res.json(users);
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ message: "Search failed" });
  }
});

/* =========================
   👤 GET PROFILE BY USERNAME
   GET /api/profile/:username
========================= */
router.get("/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username
    }).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const postsCount = await Post.countDocuments({
      author: user.username
    });

    res.json({
      username: user.username,
      name: user.name || "",
      dept: user.dept || "",
      startYear: user.startYear || "",
      endYear: user.endYear || "",
      about: user.about || "",
      profilePic: user.profilePic || "",
      friends: user.friends || [],
      postsCount
    });
  } catch (err) {
    console.error("PROFILE LOAD ERROR:", err);
    res.status(500).json({ message: "Profile load failed" });
  }
});

/* =========================
   ✏️ UPDATE PROFILE
   PUT /api/profile
========================= */
router.put("/", auth, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
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
    ).select("-password");

    res.json(updated);
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
});

module.exports = router;
