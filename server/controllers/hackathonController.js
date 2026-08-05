const Hackathon = require("../models/Hackathon");

// Create Hackathon
const createHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Hackathon Created Successfully",
      hackathon,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Hackathons
const getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find()
      .populate("createdBy", "name email");

    res.status(200).json(hackathons);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Hackathon
const getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!hackathon) {
      return res.status(404).json({
        message: "Hackathon not found",
      });
    }

    res.status(200).json(hackathon);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Hackathon
const updateHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        message: "Hackathon not found",
      });
    }

    if (hackathon.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    Object.assign(hackathon, req.body);
    await hackathon.save();

    res.status(200).json({
      message: "Hackathon Updated Successfully",
      hackathon,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Hackathon
const deleteHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        message: "Hackathon not found",
      });
    }

    if (hackathon.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await hackathon.deleteOne();

    res.status(200).json({
      message: "Hackathon Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Register for Hackathon
const registerHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        message: "Hackathon not found",
      });
    }

    if (hackathon.participants.includes(req.user._id)) {
      return res.status(400).json({
        message: "Already Registered",
      });
    }

    hackathon.participants.push(req.user._id);
    await hackathon.save();

    res.status(200).json({
      message: "Registered Successfully",
      hackathon,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createHackathon,
  getHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
  registerHackathon,
};