const Project = require("../models/Project");

// Create Project
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      category,
      teamMembers,
      githubUrl,
      liveDemoUrl,
      image,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      technologies: Array.isArray(technologies) ? technologies : [],
      category,
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
      githubUrl,
      liveDemoUrl,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Project Created Successfully",
      project,
    });
  } catch (error) {
    console.error("Create Project Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Projects
const getProjects = async (req, res) => {
  try {
    // Safety check
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find()
        .populate("createdBy", "name email college")
        .sort({ createdAt: -1 });
    } else {
      projects = await Project.find({
        createdBy: req.user._id,
      })
        .populate("createdBy", "name email college")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Get Projects Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "createdBy",
      "name email college"
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Get Project Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (
      project.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    Object.assign(project, req.body);

    await project.save();

    res.status(200).json({
      message: "Project Updated Successfully",
      project,
    });
  } catch (error) {
    console.error("Update Project Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (
      project.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      message: "Project Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};