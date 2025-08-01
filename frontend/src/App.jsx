import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import FileUpload from "./components/FileUpload";

const API_URL = "https://shareeasy-backend-gnjm.onrender.com/api";
const UPLOADS_URL = "https://shareeasy-backend-gnjm.onrender.com/api/upload";

console.log("Backend API URL:", API_URL);
console.log("Uploads URL:", UPLOADS_URL);

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<FileUpload />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
