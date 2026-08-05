const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  getChatUsers,
  getMessagesWithUser,
  createMessage,
  uploadMessageAttachment,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/users", protect, getChatUsers);
router.get("/:targetId", protect, getMessagesWithUser);
router.post("/", protect, createMessage);
router.post("/upload", protect, upload.single("file"), uploadMessageAttachment);

module.exports = router;