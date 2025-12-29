const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Comment = require("../models/Comment");

/* GET comments for a post */
router.get("/:postId", auth, async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId })
    .sort({ createdAt: 1 });
  res.json(comments);
});

/* ADD comment or reply */
router.post("/", auth, async (req, res) => {
  const comment = await Comment.create({
    postId: req.body.postId,
    content: req.body.content,
    parentComment: req.body.parentComment || null,
    author: req.user.username
  });

  res.json(comment);
});

module.exports = router;
