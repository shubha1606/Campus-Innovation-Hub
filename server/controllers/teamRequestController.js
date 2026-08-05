const TeamRequest = require("../models/TeamRequest");
const { createNotification } = require("./notificationController");

// Create Team Request
const createTeamRequest = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can create team requests' })
    }

    const { receiver, project, message } = req.body;

    const request = await TeamRequest.create({
      sender: req.user._id,
      receiver,
      project,
      message,
    });

    await createNotification(
      {
        userId: receiver,
        userModel: 'User',
        type: "teamRequest",
        title: "New team request",
        message: `${req.user.name} sent you a new team request.`,
        link: "/student/team-requests",
      },
      req
    );

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

// Get Team Requests relevant to the current user
const getTeamRequests = async (req, res) => {
  try {
    const filter = {}

    if (req.user.role === 'student') {
      filter.$or = [{ sender: req.user._id }, { receiver: req.user._id }]
    } else {
      // Only students participate in team requests
      return res.status(200).json([])
    }

    const requests = await TeamRequest.find(filter)
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage")
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

    if (request.sender.toString() !== req.user._id.toString() && request.receiver.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = req.body.status;

    await request.save();

    await createNotification(
      {
        userId: request.sender,
        userModel: 'User',
        type: "teamRequest",
        title: `Team request ${request.status.toLowerCase()}`,
        message: `Your team request was ${request.status.toLowerCase()}.`,
        link: "/student/team-requests",
      },
      req
    );

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