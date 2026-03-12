const express = require("express");
const router = express.Router();
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");

const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");

// Azure Blob Storage Connection
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient("resumes");

// Multer memory storage (file stored in RAM temporarily)
const storage = multer.memoryStorage();
const upload = multer({ storage });


// ==============================
// 1️⃣ Upload Resume API
// ==============================
router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { name, email } = req.body;

      const blobName = Date.now() + "-" + req.file.originalname;

      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(req.file.buffer);

      const blobUrl = blockBlobClient.url;

      console.log("File uploaded to Blob:", blobUrl);

      const newResume = new Resume({
        name,
        email,
        resumeUrl: blobUrl
      });

      await newResume.save();

      res.json({
        message: "Resume Uploaded Successfully",
        data: newResume
      });

    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ error: "Resume Upload Failed" });
    }
  }
);


// ==============================
// 2️⃣ Get All Resumes API
// ==============================
router.get("/", authMiddleware, async (req, res) => {
  try {

    const resumes = await Resume.find();

    res.json(resumes);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});


// ==============================
// 3️⃣ Download Resume API
// ==============================
// Since files are now in Blob Storage, frontend can directly use blob URL
router.get("/download/:id", async (req, res) => {

  try {

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json({
      downloadUrl: resume.resumeUrl
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Download failed" });
  }
});


// ==============================
// 4️⃣ Delete Resume API
// ==============================
router.delete("/delete/:id", async (req, res) => {
  try {

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // extract blob name from URL
    const blobName = resume.resumeUrl.split("/").pop();

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.deleteIfExists();

    console.log("Blob deleted:", blobName);

    await Resume.findByIdAndDelete(req.params.id);

    res.json({ message: "Resume deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});


module.exports = router;