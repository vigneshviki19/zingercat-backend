const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,

  name: String,
  department: String,
  year: String,
  about: String,

  friends: { type: [String], default: [] },
  friendRequests: { type: [String], default: [] }
});

module.exports = mongoose.model("User", UserSchema);
