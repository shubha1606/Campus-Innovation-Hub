const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  designation: {
    type: String
  },
  expertise: [{
    type: String
  }],
  experience: {
    type: Number
  },
  linkedin: {
    type: String
  },
  availability: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Mentor", mentorSchema);