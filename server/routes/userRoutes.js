const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  getUserById,
  updateUser,
  matchUsersBySkill,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/profile", protect, getUserProfile);

// User CRUD
router.get("/", protect, getUsers);
router.get("/match/:skill", protect, matchUsersBySkill); // Keep BEFORE /:id
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);

module.exports = router;