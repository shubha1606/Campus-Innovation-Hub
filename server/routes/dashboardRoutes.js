const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

// Dashboard Route
router.get("/", protect, getDashboardStats);

module.exports = router;