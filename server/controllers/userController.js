

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, college, branch, year, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role,
      college,
      branch,
      year,
      skills: Array.isArray(skills) ? skills : [],
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password, role, college, branch, year, skills } = req.body;

    const userId = req.params.id;
    const currentUserId = req.user?._id?.toString() || req.user?.id;

    if (currentUserId !== userId && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = String(email).toLowerCase();
    if (role !== undefined) updateData.role = role;
    if (college !== undefined) updateData.college = college;
    if (branch !== undefined) updateData.branch = branch;
    if (year !== undefined) updateData.year = Number(year);
    if (skills !== undefined) updateData.skills = Array.isArray(skills) ? skills : [];
    if (req.body.profileImage !== undefined) updateData.profileImage = req.body.profileImage;
    if (password) updateData.password = password;

    Object.assign(user, updateData);
    await user.save();

    res.status(200).json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const matchUsersBySkill = async (req, res) => {
  try {
    const skill = req.params.skill.trim();

    if (!skill) {
      return res.status(400).json({ message: "Please provide a skill" });
    }

    const users = await User.find({
      _id: { $ne: req.user._id },
      skills: { $regex: skill, $options: "i" },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  matchUsersBySkill,
};