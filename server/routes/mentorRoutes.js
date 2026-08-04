const express = require("express");
const router = express.Router();

const {
  registerMentor,
  loginMentor,
  getMentorProfile,
  createMentor,
  getMentors,
  getMentorById,
  updateMentor,
  deleteMentor,
} = require("../controllers/mentorController");

const { protect } = require("../middleware/authMiddleware");
const { mentorProtect } = require("../middleware/mentorAuthMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// ---------------- Authentication ----------------
router.post("/register", registerMentor);
router.post("/login", loginMentor);
router.get("/profile", mentorProtect, getMentorProfile);

// ---------------- Public Routes ----------------
router.get("/", getMentors);
router.get("/:id", getMentorById);

// ---------------- Admin Routes ----------------
router.post("/", protect, adminOnly, createMentor);
router.put("/:id", protect, adminOnly, updateMentor);
router.delete("/:id", protect, adminOnly, deleteMentor);

module.exports = router;