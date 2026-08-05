const Notification = require("../models/Notification");

const getUserModel = (req) => (req.user.role === "mentor" ? "Mentor" : "User");

const createNotification = async ({ userId, userModel, type, title, message, link }, req) => {
  const notification = await Notification.create({
    user: userId,
    userModel,
    type,
    title,
    message,
    link,
  });

  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");

  if (io && onlineUsers) {
    const socketId = onlineUsers.get(`${userModel}:${userId}`);
    if (socketId) {
      io.to(socketId).emit("notification", notification);
    }
  }

  return notification;
};

const getNotifications = async (req, res) => {
  try {
    const userModel = getUserModel(req);
    const notifications = await Notification.find({ user: req.user._id, userModel })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const userModel = getUserModel(req);
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
      userModel,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    const userModel = getUserModel(req);
    await Notification.updateMany({ user: req.user._id, userModel, read: false }, { read: true });
    const notifications = await Notification.find({ user: req.user._id, userModel })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};