import React, { useState, useRef, useCallback } from "react";
import axios from "axios";

const API_UPLOAD_URL = "https://shareeasy-backend-gnjm.onrender.com/api/upload";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadProgress(0); // Reset progress on new file selection
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadProgress(0); // Reset progress on new file drop
    }
  }, []);

  // Upload file to server with progress tracking
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await axios.post(API_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setFileUrl(response.data.fileUrl);
      setQrCodeUrl(response.data.qrCodeUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Toggle QR code visibility
  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-4 ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={!isUploading ? triggerFileInput : undefined}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={!isUploading ? handleDrop : undefined}
      >
        {file ? (
          <div>
            <p className="text-green-600 font-medium">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <p className="text-gray-500">
            {isDragging
              ? "Drop your file here"
              : "Drag & drop a file or click to select"}
          </p>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Progress bar */}
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <div className="text-right text-xs text-gray-500 mt-1">
            {uploadProgress}%
          </div>
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`w-full py-2 px-4 rounded mb-4 ${
          file && !isUploading
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {isUploading ? "Uploading..." : "Upload File"}
      </button>

      {/* Display download link after upload */}
      {fileUrl && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="font-medium mb-2">Your file is ready:</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 break-all"
          >
            {fileUrl}
          </a>

          {/* QR Code toggle button and display */}
          {qrCodeUrl && (
            <div className="mt-4">
              <button
                onClick={toggleQRCode}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm mb-2"
              >
                {showQRCode ? "Hide QR Code" : "Show QR Code"}
              </button>
              {showQRCode && (
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">Scan to download</p>
                  <img
                    src={qrCodeUrl}
                    alt="Download QR Code"
                    className="w-48 h-48 border border-gray-300 rounded"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
