const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["news", "buy", "sell", "exchange", "help"],
    required: true
  },
  price: { type: Number },
  createdBy: { type: String }, // random username
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", PostSchema);
