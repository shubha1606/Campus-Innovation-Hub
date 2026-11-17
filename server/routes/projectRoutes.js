const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  getProjectMentorMatches,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const {
  createProjectApplication,
  getGroupProjects,
  getMyProjectApplication,
  getProjectApplications,
  reviewProjectApplication,
} = require("../controllers/projectApplicationController");
const {
  createProjectComment,
  deleteProjectComment,
  getProjectComments,
} = require("../controllers/projectDiscussionController");
const {
  createProjectUpdate,
  deleteProjectUpdate,
  getProjectUpdates,
  updateProjectUpdate,
} = require("../controllers/projectUpdateController");

const { protect } = require("../middleware/authMiddleware");

// Protected Routes
router.get("/", protect, getProjects);
router.get("/discover", protect, getGroupProjects);
router.get("/:id/mentor-matches", protect, getProjectMentorMatches);
router.get("/:projectId/applications/mine", protect, getMyProjectApplication);
router.get("/:projectId/applications", protect, getProjectApplications);
router.post("/:projectId/applications", protect, createProjectApplication);
router.put("/:projectId/applications/:applicationId", protect, reviewProjectApplication);
router.get("/:projectId/updates", protect, getProjectUpdates);
router.post("/:projectId/updates", protect, createProjectUpdate);
router.put("/:projectId/updates/:updateId", protect, updateProjectUpdate);
router.delete("/:projectId/updates/:updateId", protect, deleteProjectUpdate);
router.get("/:projectId/comments", protect, getProjectComments);
router.post("/:projectId/comments", protect, createProjectComment);
router.delete("/:projectId/comments/:commentId", protect, deleteProjectComment);
router.get("/:id", protect, getProjectById);
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;