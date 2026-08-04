const express = require("express");
const cors = require("cors");
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

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Campus Innovation Hub Backend is Running...");
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});