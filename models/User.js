const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  about: {
    type: String,
    default: ""
  },
  friends: {
    type: [String],   // store usernames
    default: []       // 🔥 THIS FIXES THE CRASH
  },
  friendRequests: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model("User", UserSchema);
