const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "zingercat_posts",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

const upload = multer({ storage });

// CREATE POST
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.create({
      author: req.user.username,
      content: req.body.content,
      image: req.file ? req.file.path : null
    });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET FEED
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// LIKE
router.post("/:id/like", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.likes += 1;
  await post.save();
  res.json(post);
});

module.exports = router;
