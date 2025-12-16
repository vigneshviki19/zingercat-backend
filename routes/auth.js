const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateUsername = require("../utils/generateUsername");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = new User({ email, password });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});


  const hashedPassword = await bcrypt.hash(password, 10);
  const username = generateUsername();

  try {
    const user = await User.create({
      email,
      password: hashedPassword,
      username
    });

    res.json({ message: "Registered", username });
  } catch (err) {
    res.status(400).json({ message: "User already exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    username: user.username,
    role: user.role
  });
});

module.exports = router;
