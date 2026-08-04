const Startup = require("../models/Startup");

// Create Startup
const createStartup = async (req, res) => {
  try {
    const {
      title,
      description,
      problemStatement,
      solution,
      domain,
      teamMembers,
      status,
    } = req.body;

    const startup = await Startup.create({
      title,
      description,
      problemStatement,
      solution,
      domain,
      teamMembers,
      status,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Startup Created Successfully",
      startup,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Startups
const getStartups = async (req, res) => {
  try {
    const startups = await Startup.find().populate(
      "createdBy",
      "name email college"
    );

    res.status(200).json(startups);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Startup
const getStartupById = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id).populate(
      "createdBy",
      "name email college"
    );

    if (!startup) {
      return res.status(404).json({
        message: "Startup not found",
      });
    }

    res.status(200).json(startup);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Startup
const updateStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({
        message: "Startup not found",
      });
    }

    if (startup.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    Object.assign(startup, req.body);
    await startup.save();

    res.status(200).json({
      message: "Startup Updated Successfully",
      startup,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Startup
const deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({
        message: "Startup not found",
      });
    }

    if (startup.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await startup.deleteOne();

    res.status(200).json({
      message: "Startup Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createStartup,
  getStartups,
  getStartupById,
  updateStartup,
  deleteStartup,
};