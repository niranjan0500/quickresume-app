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

const app = express(); // ✅ create app first


// Detect environment (Azure vs Local)
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


// connect MongoDB
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
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});