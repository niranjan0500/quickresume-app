const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");


// Absolute path for uploads folder
const uploadDir = "/home/site/wwwroot/uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// 1️⃣ Upload Resume API
router.post("/upload", authMiddleware, upload.single("resume"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { name, email } = req.body;

    const newResume = new Resume({
      name,
      email,
      resume: req.file.filename
    });

    await newResume.save();

    res.json({
      message: "Resume Uploaded Successfully",
      data: newResume,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Resume Upload Failed" });
  }
});


// 2️⃣ Get All Resumes API
router.get("/", authMiddleware, async (req, res) => {
  try {

    const resumes = await Resume.find();

    res.json(resumes);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});


// 3️⃣ Download Resume API
router.get("/download/:filename", (req, res) => {

  const filePath = path.join(uploadDir, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.download(filePath);

});


// 4️⃣ Delete Resume API
router.delete("/delete/:id", async (req, res) => {
  try {

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const filePath = path.join(uploadDir, resume.resume);

    // delete file if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // delete database record
    await Resume.findByIdAndDelete(req.params.id);

    res.json({ message: "Resume deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Delete failed" });
  }
});


module.exports = router;