const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ===========================
   ENSURE uploads/ EXISTS
=========================== */
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ===========================
   MULTER CONFIG
=========================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + safeName);
  }
});

const upload = multer({ storage });

/* ===========================
   GET POSTS
=========================== */
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load posts" });
  }
});

/* ===========================
   CREATE POST
=========================== */
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
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

module.exports = router;
