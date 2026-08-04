const express = require("express");
const router = express.Router();

const {
  createStartup,
  getStartups,
  getStartupById,
  updateStartup,
  deleteStartup,
} = require("../controllers/startupController");

const { protect } = require("../middleware/authMiddleware");

// Public Routes
router.get("/", getStartups);
router.get("/:id", getStartupById);

// Protected Routes
router.post("/", protect, createStartup);
router.put("/:id", protect, updateStartup);
router.delete("/:id", protect, deleteStartup);

module.exports = router;