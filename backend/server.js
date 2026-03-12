const appInsights = require("applicationinsights");

// Application Insights Setup
const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

if (connectionString) {
  appInsights.setup(connectionString)
    .setAutoCollectRequests(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectConsole(true)
    .setSendLiveMetrics(true)
    .start();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const fs = require("fs");
const path = require("path");

// ✅ Azure Blob Storage SDK
const { BlobServiceClient } = require("@azure/storage-blob");

const app = express();


// ============================
// Azure Blob Storage Setup
// ============================

const blobConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

let containerClient = null;

if (blobConnectionString) {
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(blobConnectionString);

  containerClient = blobServiceClient.getContainerClient("resumes");

  console.log("Azure Blob Storage connected");
}

// Export container client so routes can use it
module.exports.containerClient = containerClient;


// ============================
// Detect environment
// ============================

const uploadDir = process.env.WEBSITE_INSTANCE_ID
  ? "/home/site/wwwroot/uploads"
  : path.join(__dirname, "uploads");


// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads folder created:", uploadDir);
}


// middleware
app.use(cors());
app.use(express.json());


// Serve uploaded files
app.use("/uploads", express.static(uploadDir));


// ============================
// MongoDB Connection
// ============================

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));


// import routes
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");


// use routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);


// test route
app.get("/", (req,res)=>{
    res.send("Backend API Running");
});


// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});