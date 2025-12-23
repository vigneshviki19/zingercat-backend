const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },

    username: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    about: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    // ✅ FRIEND SYSTEM
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],

    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
