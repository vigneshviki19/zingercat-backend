const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
require("dotenv").config();

// ROUTES
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const friendRoutes = require("./routes/friends");
const profileRoutes = require("./routes/profile");

// MODELS (for socket)
const ChatMessage = require("./models/ChatMessage");
const PrivateMessage = require("./models/PrivateMessage");

// 🔥 CREATE APP FIRST
const app = express();
const server = http.createServer(app);

// 🔥 SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ SERVE UPLOADS (IMPORTANT)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// 🔥 DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

// 🔥 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/profile", profileRoutes);

// 🔥 SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // PUBLIC CHAT
  socket.on("sendMessage", async (data) => {
    const saved = await ChatMessage.create({
      user: data.user,
      message: data.message
    });
    io.emit("receiveMessage", saved);
  });

  // PRIVATE CHAT
  socket.on("joinPrivate", async ({ roomId }) => {
    socket.join(roomId);

    const history = await PrivateMessage.find({ roomId }).sort({
      createdAt: 1
    });

    socket.emit("privateHistory", history);
  });

  socket.on("sendPrivate", async (data) => {
    const saved = await PrivateMessage.create(data);
    io.to(data.roomId).emit("receivePrivate", saved);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// 🔥 TEST ROUTE
app.get("/", (req, res) => {
  res.send("Zinger Cat backend running 🐱");
});

// 🔥 START SERVER
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
