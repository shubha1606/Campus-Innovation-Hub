const User = require("../models/User");
const Project = require("../models/Project");
const Event = require("../models/Event");
const Mentor = require("../models/Mentor");
const Startup = require("../models/Startup");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalMentors = await Mentor.countDocuments();
    const totalStartups = await Startup.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProjects,
        totalEvents,
        totalMentors,
        totalStartups,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};