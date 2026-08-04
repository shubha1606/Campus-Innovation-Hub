const express = require("express");
const router = express.Router();

const {
  createTeamRequest,
  getTeamRequests,
  updateTeamRequest,
} = require("../controllers/teamRequestController");

const { protect } = require("../middleware/authMiddleware");

// Routes
router.post("/", protect, createTeamRequest);
router.get("/", protect, getTeamRequests);
router.put("/:id", protect, updateTeamRequest);

module.exports = router;