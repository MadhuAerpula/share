const express = require("express");
const multer = require("multer");
const path = require("path");
const QRCode = require("qrcode");
const File = require("../models/File");
const fs = require("fs");

const router = express.Router();

// Load env variables
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const UPLOADS_DIR = process.env.UPLOADS_DIR || "uploads";

// Ensure uploads directory exists
const uploadsDirPath = path.join(__dirname, `../${UPLOADS_DIR}`);
if (!fs.existsSync(uploadsDirPath)) {
  fs.mkdirSync(uploadsDirPath, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST /api/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/files/${req.file.filename}`;

    const qrCodeDataUrl = await QRCode.toDataURL(fileUrl);

    const newFile = new File({
      filename: req.file.filename,
      fileUrl,
      qrCodeUrl: qrCodeDataUrl,
    });

    await newFile.save();

    res.status(200).json({
      status: "success",
      fileUrl,
      qrCodeUrl: qrCodeDataUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      status: "error",
      error: "Upload failed",
      details: error.message,
    });
  }
});

module.exports = router;
