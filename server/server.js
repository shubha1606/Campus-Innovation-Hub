const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const eventRoutes = require("./routes/eventRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const startupRoutes = require("./routes/startupRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const teamRequestRoutes = require("./routes/teamRequestRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const hackathonRoutes = require("./routes/hackathonRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// Middleware
app.use(cors());

// Increase request body size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/team-requests", teamRequestRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Campus Innovation Hub Backend is Running...");
});

// Socket Authentication
io.use((socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers?.authorization?.split(" ")[1];

  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    return next();
  } catch (error) {
    return next(new Error("Authentication error"));
  }
});

// Socket Connection
io.on("connection", (socket) => {
  socket.on("register", ({ userId, userModel }) => {
    const id = userId || socket.user?.id;
    const model = userModel || "User";

    if (id && model) {
      onlineUsers.set(`${model}:${id}`, socket.id);
      socket.userId = id;
      socket.userModel = model;
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId && socket.userModel) {
      onlineUsers.delete(`${socket.userModel}:${socket.userId}`);
    }
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});