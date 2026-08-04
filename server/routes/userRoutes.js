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

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getUserProfile);
router.get("/", protect, getUsers);
router.get("/match/:skill", protect, matchUsersBySkill);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);

module.exports = router;