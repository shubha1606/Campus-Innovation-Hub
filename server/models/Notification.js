const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Receiver
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userModel",
    },
    userModel: {
      type: String,
      required: true,
      enum: ["User", "Mentor"],
    },

    // Sender
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      enum: ["User", "Mentor"],
    },
    senderName: {
      type: String,
      default: "",
      trim: true,
    },
    senderAvatar: {
      type: String,
      default: "",
    },

    // Notification details
    type: {
      type: String,
      enum: [
        "message",
        "booking",
        "teamRequest",
        "event",
        "idea",
        "system",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    link: {
      type: String,
      default: "",
      trim: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);