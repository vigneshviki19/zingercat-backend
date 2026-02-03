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

  /* PROFILE */
  name: { type: String, default: "" },
  dept: { type: String, default: "" },
  startYear: { type: Number, default: 2020 },
  endYear: { type: Number, default: 2024 },
  about: { type: String, default: "" },
  profilePic: { type: String, default: "" },

  /* FRIEND SYSTEM */
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("User", UserSchema);
