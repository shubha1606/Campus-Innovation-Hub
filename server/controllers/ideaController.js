const Idea = require("../models/Idea");

// Create Idea
const createIdea = async (req, res) => {
  try {
    const { title, description, domain, technologies, status } = req.body;

    const idea = await Idea.create({
      title,
      description,
      domain,
      technologies,
      status,
      createdBy: req.user._id,
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
      "createdBy",
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
      "createdBy",
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
    const idea = await Idea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    res.status(200).json({
      message: "Idea Updated Successfully",
      idea,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Idea
const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findByIdAndDelete(req.params.id);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    res.status(200).json({
      message: "Idea Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createIdea,
  getIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
};