const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const ChatMessage = require("./models/ChatMessage"); // 🔥 IMPORTANT

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(console.error);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

/* ================= SOCKET.IO ================= */
io.on("connection", async (socket) => {
  console.log("🟢 User connected:", socket.id);

  // 🔥 SEND OLD MESSAGES WHEN USER CONNECTS
  const history = await ChatMessage.find()
    .sort({ createdAt: 1 })
    .limit(50);

  socket.emit("chatHistory", history);

  // 🔥 RECEIVE MESSAGE, SAVE, BROADCAST
  socket.on("sendMessage", async (data) => {
    const savedMessage = await ChatMessage.create({
      user: data.user,
      text: data.text,
    });

    io.emit("receiveMessage", savedMessage);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Zinger Cat backend running 🐱");
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
