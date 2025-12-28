const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const multer = require("multer");
const path = require("path");

/* ---------- MULTER SETUP ---------- */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ---------- CREATE POST ---------- */
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

/* ---------- GET ALL POSTS ---------- */
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load posts" });
  }
});

module.exports = router;
