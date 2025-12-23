const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

/**
 * GET FRIENDS LIST
 */
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.friends || []);
});

module.exports = router;
