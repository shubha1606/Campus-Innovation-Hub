const TeamRequest = require("../models/TeamRequest");

// Create Team Request
const createTeamRequest = async (req, res) => {
  try {
    const { receiver, project, message } = req.body;

    const request = await TeamRequest.create({
      sender: req.user._id,
      receiver,
      project,
      message,
    });

    res.status(201).json({
      message: "Team Request Sent Successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Team Requests
const getTeamRequests = async (req, res) => {
  try {
    const requests = await TeamRequest.find()
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .populate("project", "title");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Team Request Status
const updateTeamRequest = async (req, res) => {
  try {
    const request = await TeamRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Team Request not found",
      });
    }

    request.status = req.body.status;

    await request.save();

    res.status(200).json({
      message: "Team Request Updated Successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTeamRequest,
  getTeamRequests,
  updateTeamRequest,
};