const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateUsername = require("../utils/generateUsername");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔴 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = generateUsername();

    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      role: "user",
    });

    res.status(201).json({
      success: true,
      message: "User registered",
    });
  } catch (err) {
    res.status(500).json({ message: "Register failed" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔴 CORRECT PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
