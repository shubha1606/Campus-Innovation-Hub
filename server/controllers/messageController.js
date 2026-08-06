const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Message = require("../models/Message");
const { createNotification } = require("./notificationController");

const getCurrentModel = (req) => (req.user.role === "mentor" ? "Mentor" : "User");

const getChatUsers = async (req, res) => {
  try {
    const currentId = req.user._id;
    const users = await User.find({ _id: { $ne: currentId } }).select("-password").lean();
    const mentors = await Mentor.find({ _id: { $ne: currentId } }).select("-password").lean();

    const chatUsers = [
      ...users.map((u) => ({ ...u, role: u.role || "student", model: "User" })),
      ...mentors.map((m) => ({ ...m, role: "mentor", model: "Mentor" })),
    ];

    res.status(200).json(chatUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessagesWithUser = async (req, res) => {
  try {
    const { targetId } = req.params;
    const { targetModel } = req.query;

    if (!targetId || !targetModel || !["User", "Mentor"].includes(targetModel)) {
      return res.status(400).json({ message: "targetId and targetModel are required" });
    }

    const currentModel = getCurrentModel(req);

    await Message.updateMany(
      {
        sender: targetId,
        senderModel: targetModel,
        receiver: req.user._id,
        receiverModel: currentModel,
        read: false,
      },
      { read: true }
    );

    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
          senderModel: currentModel,
          receiver: targetId,
          receiverModel: targetModel,
        },
        {
          sender: targetId,
          senderModel: targetModel,
          receiver: req.user._id,
          receiverModel: currentModel,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMessage = async (req, res) => {
  try {
    const { receiverId, receiverModel, text, attachment } = req.body;

    if (!receiverId || !receiverModel) {
      return res.status(400).json({ message: "receiverId and receiverModel are required" });
    }

    if (!text && !attachment) {
      return res.status(400).json({ message: "Message text or attachment required" });
    }

    const senderModel = getCurrentModel(req);

    const message = await Message.create({
      sender: req.user._id,
      senderModel,
      receiver: receiverId,
      receiverModel,
      text,
      attachment,
    });

    const payload = message.toObject();

    const messageLink =
  receiverModel === "Mentor"
    ? "/mentor/messages"
    : "/student/messages";

await createNotification(
  {
    userId: receiverId,
    userModel: receiverModel,
    type: "message",
    title: "New Message",
    message: text
      ? `${req.user.name} sent you a message`
      : `${req.user.name} sent you a file`,
    link: messageLink,
  },
  req
);

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    if (io && onlineUsers) {
      const receiverSocketId = onlineUsers.get(`${receiverModel}:${receiverId}`);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", payload);
      }
    }

    res.status(201).json({ message: "Message sent successfully", data: payload });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadMessageAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File upload required" });
    }

    res.status(200).json({
      attachment: {
        filename: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChatUsers,
  getMessagesWithUser,
  createMessage,
  uploadMessageAttachment,
};