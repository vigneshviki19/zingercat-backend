const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ✅ ENSURE uploads folder exists (SAFE)
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Model
const Post = mongoose.model("Post");

/* ---------------- CREATE POST WITH IMAGE ---------------- */
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content,
      author: req.user.username,
      userId: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("POST CREATE ERROR:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

/* ---------------- GET ALL POSTS ---------------- */
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load posts" });
  }
});

module.exports = router;
