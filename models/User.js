const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  username: { type: String, unique: true },

  about: {
    type: String,
    default: ""
  },

  friends: {
    type: [String],
    default: []
  },

  friendRequests: {
    type: [String],
    default: []
  },

  role: {
    type: String,
    default: "user"
  }
});

module.exports = mongoose.model("User", userSchema);
