require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

// Load environment variables
const PORT = process.env.PORT || 5000;
const UPLOADS_DIR = process.env.UPLOADS_DIR || "uploads";
const CLIENT_URL = process.env.CLIENT_URL || "*"; // Set this to your frontend URL

// Middleware
app.use(cors({
  origin: CLIENT_URL, // e.g. "https://your-frontend.onrender.com"
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend is running!",
    availableRoutes: [
      { method: "GET", path: "/api/home" },
      { method: "POST", path: "/api/upload" },
      { method: "GET", path: "/files/:filename" },
    ],
  });
});

// Serve uploaded files
app.use("/files", express.static(path.join(__dirname, UPLOADS_DIR)));

// API routes
app.use("/api", fileRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
    requestedUrl: req.originalUrl,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving uploaded files from: /files`);
  console.log(`🌐 CORS allowed for: ${CLIENT_URL}`);
});
