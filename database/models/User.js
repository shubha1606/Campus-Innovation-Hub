const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "student"
  },
  college: {
    type: String
  },
  department: {
    type: String
  },
  year: {
    type: Number
  },
  skills: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);