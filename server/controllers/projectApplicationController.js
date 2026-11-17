const Project = require("../models/Project");
const ProjectApplication = require("../models/ProjectApplication");
const { getUserId, isProjectOwner } = require("../utils/projectAccess");

const createProjectApplication = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can request to join projects" });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.projectType !== "Group") {
      return res.status(400).json({ message: "Only group projects accept applications" });
    }
    if (isProjectOwner(project, req.user)) {
      return res.status(400).json({ message: "You cannot apply to your own project" });
    }
    if (project.teamMembers.some((member) => member.toString() === getUserId(req.user))) {
      return res.status(409).json({ message: "You are already a project member" });
    }

    const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
    if (message.length > 1000) {
      return res.status(400).json({ message: "Application message must be 1000 characters or fewer" });
    }

    let application = await ProjectApplication.findOne({
      project: project._id,
      applicant: getUserId(req.user),
    });

    if (application && application.status !== "Declined") {
      return res.status(409).json({
        message: `Your application is already ${application.status.toLowerCase()}`,
        application,
      });
    }

    if (application) {
      application.message = message;
      application.status = "Pending";
      application.reviewedAt = undefined;
      await application.save();
    } else {
      application = await ProjectApplication.create({
        project: project._id,
        applicant: getUserId(req.user),
        message,
      });
    }

    res.status(201).json({ message: "Join request sent", application });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "You already have an application for this project" });
    }
    res.status(500).json({ message: error.message });
  }
};

const getMyProjectApplication = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can view their join requests" });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const application = await ProjectApplication.findOne({
      project: project._id,
      applicant: getUserId(req.user),
    });
    res.status(200).json(application);
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

const getProjectApplications = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!isProjectOwner(project, req.user) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only the project owner can review applications" });
    }

    const applications = await ProjectApplication.find({ project: project._id })
      .populate("applicant", "name skills interests profileImage")
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

const reviewProjectApplication = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Approved", "Declined"].includes(status)) {
      return res.status(400).json({ message: "Application status must be Approved or Declined" });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!isProjectOwner(project, req.user) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only the project owner can review applications" });
    }

    const application = await ProjectApplication.findOne({
      _id: req.params.applicationId,
      project: project._id,
    });
    if (!application) return res.status(404).json({ message: "Application not found" });
    if (application.status !== "Pending") {
      return res.status(409).json({ message: "This application has already been reviewed" });
    }

    if (status === "Approved") {
      const alreadyMember = project.teamMembers.some(
        (member) => member.toString() === application.applicant.toString()
      );
      if (!alreadyMember) {
        project.teamMembers.push(application.applicant);
        await project.save();
      }
    }

    application.status = status;
    application.reviewedAt = new Date();
    await application.save();
    res.status(200).json({ message: `Application ${status.toLowerCase()}`, application });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const getGroupProjects = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can browse group projects" });
    }

    const projects = await Project.find({ projectType: "Group" })
      .populate("createdBy", "name profileImage")
      .populate("teamMembers", "name")
      .sort({ createdAt: -1 });
    const projectIds = projects.map((project) => project._id);
    const applications = await ProjectApplication.find({
      applicant: getUserId(req.user),
      project: { $in: projectIds },
    }).select("project status");
    const applicationStatus = new Map(
      applications.map((application) => [
        application.project.toString(),
        application.status,
      ])
    );

    res.status(200).json(
      projects.map((project) => ({
        ...project.toObject(),
        applicationStatus: applicationStatus.get(project._id.toString()) || null,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProjectApplication,
  getGroupProjects,
  getMyProjectApplication,
  getProjectApplications,
  reviewProjectApplication,
};
