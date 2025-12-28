const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const Post = require("../models/Post");

// ✅ storage (DO NOT CREATE DIR MANUALLY)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  }
});

const upload = multer({ storage });

/* ---------------- CREATE POST ---------------- */
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      author: req.user.username,
      userId: req.user.id
    });

    res.json(post);
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ message: "Post failed" });
  }
});

/* ---------------- GET POSTS ---------------- */
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

module.exports = router;
