const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Comment = require("../models/Comment");

/* =========================
   GET COMMENTS FOR POST
========================= */
router.get("/:postId", auth, async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to load comments" });
  }
});

/* =========================
   ADD COMMENT / REPLY
========================= */
router.post("/", auth, async (req, res) => {
  try {
    const comment = new Comment({
      postId: req.body.postId,
      content: req.body.content,
      parentComment: req.body.parentComment || null,
      author: req.user.username,
      userId: req.user.id
    });

    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
});

module.exports = router;
