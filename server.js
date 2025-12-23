const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const ChatMessage = require("./models/ChatMessage");
const PrivateMessage = require("./models/PrivateMessage");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
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
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // JOIN PRIVATE ROOM
  socket.on("joinPrivate", async ({ roomId }) => {
    socket.join(roomId);

    const history = await PrivateMessage.find({ roomId })
      .sort({ createdAt: 1 });

    socket.emit("privateHistory", history);
  });

  // SEND PRIVATE MESSAGE
  socket.on("sendPrivate", async (data) => {
    const saved = await PrivateMessage.create(data);
    io.to(data.roomId).emit("receivePrivate", saved);
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
