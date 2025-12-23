const express = require("express");
const ChatMessage = require("../models/ChatMessage");

const router = express.Router();

// Get all chat messages
router.get("/", async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to load chat messages" });
  }
});

module.exports = router;
