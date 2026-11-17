const Project = require("../models/Project");
const ProjectUpdate = require("../models/ProjectUpdate");
const {
  canContributeToProject,
  getUserId,
} = require("../utils/projectAccess");

const getProjectUpdates = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const updates = await ProjectUpdate.find({ project: project._id })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });
    res.status(200).json(updates);
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

const createProjectUpdate = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!canContributeToProject(project, req.user)) {
      return res.status(403).json({ message: "Only project members can post updates" });
    }

    const type = req.body.type || "update";
    const update = await ProjectUpdate.create({
      project: project._id,
      author: getUserId(req.user),
      type,
      title: req.body.title,
      body: req.body.body,
      status: req.body.status || (type === "milestone" ? "planned" : "in_progress"),
      dueDate: req.body.dueDate || undefined,
    });
    res.status(201).json({ message: "Project update created", update });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateProjectUpdate = async (req, res) => {
  try {
    const update = await ProjectUpdate.findById(req.params.updateId);
    if (!update || update.project.toString() !== req.params.projectId.toLowerCase()) {
      return res.status(404).json({ message: "Project update not found" });
    }

    const project = await Project.findById(update.project);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!canContributeToProject(project, req.user)) {
      return res.status(403).json({ message: "Only project members can update milestones" });
    }

    for (const field of ["type", "title", "body", "status", "dueDate"]) {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    }
    await update.save();
    res.status(200).json({ message: "Project update saved", update });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteProjectUpdate = async (req, res) => {
  try {
    const update = await ProjectUpdate.findById(req.params.updateId);
    if (!update || update.project.toString() !== req.params.projectId.toLowerCase()) {
      return res.status(404).json({ message: "Project update not found" });
    }

    const project = await Project.findById(update.project);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!canContributeToProject(project, req.user)) {
      return res.status(403).json({ message: "Only project members can delete updates" });
    }

    await update.deleteOne();
    res.status(200).json({ message: "Project update deleted" });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProjectUpdate,
  deleteProjectUpdate,
  getProjectUpdates,
  updateProjectUpdate,
};
