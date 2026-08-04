const jwt = require("jsonwebtoken");
const Mentor = require("../models/Mentor");

const mentorProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
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
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const mentor = await Mentor.findById(decoded.id).select("-password");

    if (!mentor) {
      return res.status(401).json({ message: "Mentor not found" });
    }

    req.user = mentor;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid mentor token" });
  }
};

module.exports = { mentorProtect };