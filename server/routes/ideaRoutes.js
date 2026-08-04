const express = require("express");
const router = express.Router();

const {
  createIdea,
  getIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
} = require("../controllers/ideaController");

const { protect } = require("../middleware/authMiddleware");

// Public
router.get("/", getIdeas);
router.get("/:id", getIdeaById);

// Protected
router.post("/", protect, createIdea);
router.put("/:id", protect, updateIdea);
router.delete("/:id", protect, deleteIdea);

module.exports = router;