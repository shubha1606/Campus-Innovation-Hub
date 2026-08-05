const jwt = require("jsonwebtoken");
const crypto = require('crypto')
const User = require("../models/User");
const sendEmail = require('../utils/sendEmail')

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      college,
      branch,
      year,
      skills,
      interests,
      bio,
      profileImage,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    const normalizedEmail = String(email).toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const safeRole = role === "mentor" || role === "admin" ? role : "student";

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: safeRole,
      college,
      branch,
      year,
      skills: Array.isArray(skills) ? skills : [],
      interests: Array.isArray(interests) ? interests : [],
      bio,
      profileImage,
    });

    res.status(201).json({
      token: generateToken(user),
      role: user.role,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      token: generateToken(user),
      role: user.role,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required' })

    const user = await User.findOne({ email: String(email).toLowerCase() })
    if (!user) {
      // respond success to avoid account enumeration
      return res.status(200).json({ message: 'If an account exists, reset instructions have been sent' })
    }

    const resetToken = crypto.randomBytes(20).toString('hex')
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

    user.resetPasswordToken = resetTokenHash
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
    await user.save()

    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173'
    const resetUrl = `${frontend.replace(/\/$/, '')}/reset-password/${resetToken}`

    const message = `You requested a password reset. Click the link to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, please ignore.`

    try {
      await sendEmail({ to: user.email, subject: 'Password Reset', text: message })
    } catch (err) {
      console.error('Failed to send reset email', err)
    }

    return res.status(200).json({ message: 'If an account exists, reset instructions have been sent' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const resetPassword = async (req, res) => {
  try {
    const token = req.params.token
    const { password } = req.body
    if (!token || !password) return res.status(400).json({ message: 'Invalid request' })

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ resetPasswordToken: tokenHash, resetPasswordExpires: { $gt: Date.now() } })
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' })

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    return res.status(200).json({ message: 'Password reset successful' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
};
