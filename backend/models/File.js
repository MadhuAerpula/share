const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  // Add fileUrl and qrCodeUrl if you are saving them
  fileUrl: String,
  qrCodeUrl: String,
});

module.exports = mongoose.model("File", fileSchema);
