const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  fileUrl: String,
  qrCodeUrl: String,
});

module.exports = mongoose.model("File", fileSchema);
