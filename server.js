const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const adminRoutes = require("./routes/admin");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors({
  origin: "*", // later you can restrict to frontend URL
}));
app.use(express.json());

/* -------------------- DATABASE -------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.send("🐱 Zinger Cat backend is running");
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
