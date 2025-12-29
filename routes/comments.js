const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Comment = require("../models/Comment");

/* =========================
   GET COMMENTS FOR A POST
========================= */
router.get("/:postId", auth, async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId })
    .sort({ createdAt: 1 });
  res.json(comments);
});

/* =========================
   ADD COMMENT / REPLY
========================= */
router.post("/", auth, async (req, res) => {
  const { postId, text, parentId } = req.body;

  const comment = new Comment({
    postId,
    text,
    parentId: parentId || null,
    author: req.user.username
  });

  await comment.save();
  res.json(comment);
});

module.exports = router;

