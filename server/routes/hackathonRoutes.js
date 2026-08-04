const express = require("express");
const router = express.Router();

const {
  createHackathon,
  getHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
  registerHackathon,
} = require("../controllers/hackathonController");

const { protect } = require("../middleware/authMiddleware");

// Public
router.get("/", getHackathons);
router.get("/:id", getHackathonById);

// Protected
router.post("/", protect, createHackathon);
router.put("/:id", protect, updateHackathon);
router.delete("/:id", protect, deleteHackathon);

// Register
router.post("/:id/register", protect, registerHackathon);

module.exports = router;