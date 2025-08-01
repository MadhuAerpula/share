const express = require("express");
const multer = require("multer");
const path = require("path");
const QRCode = require("qrcode");
const File = require("../models/File");
const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// File upload route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    await file.save();

    const baseUrl = req.protocol + "://" + req.get("host");
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;

    const qrCodeUrl = await QRCode.toDataURL(fileUrl);

    res.status(200).json({ fileUrl, qrCodeUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
