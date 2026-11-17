const Project = require("../models/Project");
const ProjectComment = require("../models/ProjectComment");
const { getUserId, isProjectOwner } = require("../utils/projectAccess");

const getProjectComments = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const comments = await ProjectComment.find({ project: project._id })
      .populate("author", "name profileImage")
      .sort({ createdAt: 1 });
    res.status(200).json(comments);
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

const createProjectComment = async (req, res) => {
  try {
    if (!["student", "mentor"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only students and mentors can join project discussions" });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const body = typeof req.body.body === "string" ? req.body.body.trim() : "";
    if (!body) return res.status(400).json({ message: "Comment cannot be empty" });
    if (body.length > 3000) {
      return res.status(400).json({ message: "Comment must be 3000 characters or fewer" });
    }

    let parentComment = null;
    if (req.body.parentComment) {
      parentComment = await ProjectComment.findOne({
        _id: req.body.parentComment,
        project: project._id,
      });
      if (!parentComment) return res.status(404).json({ message: "Question or comment not found" });
      if (parentComment.parentComment) {
        return res.status(400).json({ message: "Replies can only be one level deep" });
      }
    }

    const comment = await ProjectComment.create({
      project: project._id,
      author: getUserId(req.user),
      authorModel: req.user.role === "mentor" ? "Mentor" : "User",
      parentComment: parentComment?._id || null,
      kind: parentComment ? "comment" : req.body.kind || "comment",
      body,
    });
    await comment.populate("author", "name profileImage");
    res.status(201).json({ message: "Discussion post created", comment });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteProjectComment = async (req, res) => {
  try {
    const comment = await ProjectComment.findOne({
      _id: req.params.commentId,
      project: req.params.projectId,
    });
    if (!comment) return res.status(404).json({ message: "Discussion post not found" });

    const project = await Project.findById(comment.project);
    if (!project) return res.status(404).json({ message: "Project not found" });
    const isAuthor =
      comment.authorModel === (req.user.role === "mentor" ? "Mentor" : "User") &&
      comment.author.toString() === getUserId(req.user);
    if (!isAuthor && !isProjectOwner(project, req.user) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await ProjectComment.deleteMany({
      $or: [{ _id: comment._id }, { parentComment: comment._id }],
    });
    res.status(200).json({ message: "Discussion post deleted" });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProjectComment,
  deleteProjectComment,
  getProjectComments,
};
