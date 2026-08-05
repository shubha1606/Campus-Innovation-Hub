const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Mentor = require("../models/Mentor");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const xAccessToken = req.headers["x-access-token"];

  let token = null;

  if (authHeader) {
    const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    const trimmed = headerValue.trim();

    if (trimmed.toLowerCase().startsWith("bearer ")) {
      token = trimmed.slice(7).trim();
    } else if (trimmed.toLowerCase().startsWith("bearer")) {
      token = trimmed.slice(6).trim();
    } else {
      token = trimmed;
    }
  } else if (xAccessToken) {
    token = Array.isArray(xAccessToken) ? xAccessToken[0] : xAccessToken;
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Try to find a User first
    let user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = user;
      return next();
    }

    // Try Mentor
    const mentor = await Mentor.findById(decoded.id).select("-password");
    if (mentor) {
      // normalize to include a role for downstream checks
      mentor.role = 'mentor';
      req.user = mentor;
      return next();
    }

    return res.status(401).json({ message: "User not found" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { protect };