const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const Post = require("../models/Post");

// multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

/* GET ALL POSTS */
router.get("/", auth, async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

/* CREATE POST */
router.post("/", auth, upload.single("image"), async (req, res) => {
  const post = new Post({
    content: req.body.content,
    author: req.user.username,
    image: req.file ? `/uploads/${req.file.filename}` : null
  });

  await post.save();
  res.json(post);
});

/* LIKE / UNLIKE */
router.post("/:id/like", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  const user = req.user.username;

  if (post.likes.includes(user)) {
    post.likes = post.likes.filter(u => u !== user);
  } else {
    post.likes.push(user);
  }

  await post.save();
  res.json(post.likes.length);
});

/* COMMENT */
router.post("/:id/comment", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);

  post.comments.push({
    user: req.user.username,
    text: req.body.text
  });

  await post.save();
  res.json(post.comments);
});

/* SHARE */
router.post("/:id/share", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.shares += 1;
  await post.save();
  res.json({ shares: post.shares });
});

module.exports = router;
