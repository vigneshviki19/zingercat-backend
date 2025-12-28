const express = require("express");
const router = express.Router();
const multer = require("multer");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// CREATE POST
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const newPost = new Post({
      content: req.body.content,
      author: req.user.username,
      userId: req.user.id,
      image: req.file ? req.file.filename : null
    });

    await newPost.save();
    res.json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Post failed" });
  }
});

// GET POSTS
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

module.exports = router;
