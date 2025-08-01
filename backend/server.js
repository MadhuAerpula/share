require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config");
const fileRoutes = require("./routes/fileRoutes");
const path = require("path");

const app = express();

// Load environment variables
const PORT = process.env.PORT || 5000;
const UPLOADS_DIR = process.env.UPLOADS_DIR || "uploads";

// Middleware
app.use(cors({
  origin: true, // Reflects the request origin
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Root Route for Debugging (Optional)
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
// Serve static files from the uploads directory
app.use("/files", express.static(path.join(__dirname, UPLOADS_DIR)));

// File routes
app.use("/api", fileRoutes);

// Handle 404 errors
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
  console.log(`📁 Static files served from /files -> ${UPLOADS_DIR}`);
  console.log(`📌 Available routes:`);
  console.log(`- GET /api/home`);
  console.log(`- POST /api/upload`);
  console.log(`- GET /files/:filename`);
});
