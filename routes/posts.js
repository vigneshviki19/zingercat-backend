const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🔥 SAFE uploads folder
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 🔥 multer config (NO mkdir crash)
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images allowed"));
    }
    cb(null, true);
  }
});

// 🔹 GET ALL POSTS
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// 🔹 CREATE POST
router.post("/", auth, (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const post = new Post({
        content: req.body.content,
        author: req.user.username,
        department: req.user.department || "CSE",
        college: "PSG Tech",
        image: req.file ? `/uploads/${req.file.filename}` : null
      });

      await post.save();
      res.json(post);
    } catch {
      res.status(500).json({ message: "Post failed" });
    }
  });
});

module.exports = router;
