const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  username: { type: String, unique: true },
  password: String,

  about: { type: String, default: "" },

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("User", UserSchema);
