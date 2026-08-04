const Idea = require("../models/Idea");

// Create Idea
const createIdea = async (req, res) => {
  try {
    const { title, description, category, requiredSkills, teamMembers } = req.body;

    const idea = await Idea.create({
      title,
      description,
      category,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      postedBy: req.user._id,
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
    });

    res.status(201).json({
      message: "Idea Created Successfully",
      idea,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Ideas
const getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find().populate(
      "postedBy",
      "name email college"
    );

    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Idea
const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).populate(
      "postedBy",
      "name email college"
    );

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Idea
const updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    if (idea.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(idea, req.body);
    await idea.save();

    res.status(200).json({
      message: "Idea Updated Successfully",
      idea,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Idea
const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    if (idea.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await idea.deleteOne();

    res.status(200).json({ message: "Idea Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createIdea,
  getIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
};