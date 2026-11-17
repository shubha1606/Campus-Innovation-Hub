const mongoose = require("mongoose");

const projectUpdateSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["update", "milestone"],
      default: "update",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ["planned", "in_progress", "completed"],
      default: "in_progress",
    },
    dueDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectUpdate", projectUpdateSchema);
