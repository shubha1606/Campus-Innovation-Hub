const Mentor = require("../models/Mentor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Create Mentor
const createMentor = async (req, res) => {
  try {
    const {
      name,
      email,
      expertise,
      experience,
      availability,
      bio,
      company,
    } = req.body;

    const mentor = await Mentor.create({
      name,
      email,
      expertise,
      experience,
      availability,
      bio,
      company,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Mentor Created Successfully",
      mentor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Register Mentor
const registerMentor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      expertise,
      experience,
      availability,
      bio,
      company,
    } = req.body;

    // Check if mentor already exists
    const existingMentor = await Mentor.findOne({ email });

    if (existingMentor) {
      return res.status(400).json({
        message: "Mentor already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create mentor
    const mentor = await Mentor.create({
      name,
      email,
      password: hashedPassword,
      expertise,
      experience,
      availability,
      bio,
      company,
    });

    res.status(201).json({
      message: "Mentor Registered Successfully",
      mentor: {
        _id: mentor._id,
        name: mentor.name,
        email: mentor.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Login Mentor
const loginMentor = async (req, res) => {
  try {

    const { email, password } = req.body;

    const mentor = await Mentor.findOne({ email });

    if (!mentor) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, mentor.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: mentor._id,
        role: "mentor",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Mentor Login Successful",
      token,
      mentor: {
        _id: mentor._id,
        name: mentor.name,
        email: mentor.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
// Get Mentor Profile
const getMentorProfile = async (req, res) => {
  try {

    const mentor = await Mentor.findById(req.user._id).select("-password");

    if (!mentor) {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }

    res.status(200).json(mentor);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
// Get All Mentors
const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().populate(
      "name email college"
    );

    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Mentor
const getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).populate(
      "createdBy",
      "name email college"
    );

    if (!mentor) {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }

    res.status(200).json(mentor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Mentor
const updateMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }

    if (mentor.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    Object.assign(mentor, req.body);
    await mentor.save();

    res.status(200).json({
      message: "Mentor Updated Successfully",
      mentor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Mentor
const deleteMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }

    if (mentor.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await mentor.deleteOne();

    res.status(200).json({
      message: "Mentor Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerMentor,
  loginMentor,
  getMentorProfile,
  createMentor,
  getMentors,
  getMentorById,
  updateMentor,
  deleteMentor,
};