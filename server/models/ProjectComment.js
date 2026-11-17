const mongoose = require("mongoose");

const projectCommentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "authorModel",
      required: true,
    },
    authorModel: {
      type: String,
      enum: ["User", "Mentor"],
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectComment",
      default: null,
    },
    kind: {
      type: String,
      enum: ["question", "comment"],
      default: "comment",
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectComment", projectCommentSchema);
