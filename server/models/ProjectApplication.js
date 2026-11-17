const mongoose = require("mongoose");

const projectApplicationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Declined"],
      default: "Pending",
    },
    reviewedAt: Date,
  },
  { timestamps: true }
);

projectApplicationSchema.index({ project: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("ProjectApplication", projectApplicationSchema);
