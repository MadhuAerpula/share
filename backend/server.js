require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config");
const fileRoutes = require("./routes/fileRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "*";
const UPLOADS_DIR = process.env.UPLOADS_DIR || "uploads";

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

// Connect DB
connectDB();

// Serve static files
// app.use("/files", express.static(path.join(__dirname, UPLOADS_DIR)));
app.use("/uploads", express.static(path.join(__dirname, UPLOADS_DIR)));


// Routes
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend is running!",
    availableRoutes: [
      { method: "POST", path: "/api/upload" },
      { method: "GET", path: "/files/:filename" },
    ],
  });
});
app.use("/api", fileRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
    requestedUrl: req.originalUrl,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
