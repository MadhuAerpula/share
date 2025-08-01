const express = require("express");
const multer = require("multer");
const path = require("path");
const QRCode = require("qrcode");
const File = require("../models/File");
const fs = require("fs");

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// File Upload Route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/files/${req.file.filename}`;
    const qrCodeUrl = await QRCode.toDataURL(fileUrl);
    
    const newFile = new File({
      filename: req.file.filename,
      fileUrl,
      qrCodeUrl,
    });

    await newFile.save();

    res.json({ 
      status: "success",
      fileUrl, 
      qrCodeUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      error: "Upload failed",
      details: error.message 
    });
  }
});

module.exports = router;
