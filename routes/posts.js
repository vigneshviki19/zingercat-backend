const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

/* =========================
   CLOUDINARY CONFIG
========================= */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* =========================
   MULTER STORAGE
========================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "zingercat/posts",
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
  }
});

const upload = multer({ storage });

/* =========================
   GET ALL POSTS
========================= */
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    res.status(500).json({ message: "Failed to load posts" });
  }
});

/* =========================
   CREATE POST
========================= */
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content || "",
      image: req.file ? req.file.path : "",
      author: req.user.username,
      userId: req.user.id
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

/* =========================
   LIKE POST
========================= */
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes += 1;
    await post.save();

    res.json({ likes: post.likes });
  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ message: "Failed to like post" });
  }
});

module.exports = router;
