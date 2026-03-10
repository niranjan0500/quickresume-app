const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Resume = require("../models/Resume");


// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


// 1️⃣ Upload Resume API
router.post("/upload", authMiddleware, upload.single("resume"), async (req, res) => {
  try {
    const { name, email } = req.body;

    const newResume = new Resume({
      name,
      email,
      resume: req.file.path,
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
router.get("/", authMiddleware, async (req,res)=>{
  try {
    const resumes = await Resume.find();
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});


// 3️⃣ Download Resume API
router.get("/download/:filename", (req, res) => {
  const path = require("path");

  const filePath = path.join(__dirname, "..", "uploads", req.params.filename);

  res.download(filePath, (err) => {
    if (err) {
      console.log(err);
      res.status(404).json({ error: "File not found" });
    }
  });
});
module.exports = router;

const fs = require("fs");

// DELETE Resume
router.delete("/delete/:id", async (req, res) => {
  try {

    // find resume in database
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // delete file from uploads folder
    fs.unlinkSync(resume.resume);

    // delete record from MongoDB
    await Resume.findByIdAndDelete(req.params.id);

    res.json({ message: "Resume deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Delete failed" });
  }
});