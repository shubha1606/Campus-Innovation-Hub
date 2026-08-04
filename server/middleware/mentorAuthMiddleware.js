const jwt = require("jsonwebtoken");
const Mentor = require("../models/Mentor");

const mentorProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const mentor = await Mentor.findById(decoded.id).select("-password");

      if (!mentor) {
        return res.status(401).json({
          message: "Mentor not found",
        });
      }

      req.user = mentor;

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid mentor token",
      });
    }
  } else {
    return res.status(401).json({
      message: "No token provided",
    });
  }
};

module.exports = { mentorProtect };