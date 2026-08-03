const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String
  },
  technologies: [{
    type: String
  }],
  teamMembers: [{
    type: String
  }],
  mentor: {
    type: String
  },
  status: {
    type: String,
    default: "Pending"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Project", projectSchema);