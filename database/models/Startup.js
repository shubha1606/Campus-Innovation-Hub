const mongoose = require("mongoose");

const startupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  problemStatement: {
    type: String
  },
  solution: {
    type: String
  },
  domain: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  teamMembers: [{
    type: String
  }],
  status: {
    type: String,
    default: "Idea"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Startup", startupSchema);