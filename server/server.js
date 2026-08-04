const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes"); // NEW
const eventRoutes = require("./routes/eventRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const startupRoutes = require("./routes/startupRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const bookingRoutes = require("./routes/bookingRoutes"); 
const teamRequestRoutes = require("./routes/teamRequestRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const hackathonRoutes = require("./routes/hackathonRoutes");

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes); // NEW
app.use("/api/events", eventRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/team-requests", teamRequestRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/hackathons", hackathonRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Campus Innovation Hub Backend is Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});