const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// import routes
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");   // NEW

// use routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);   // NEW

// test route
app.get("/", (req,res)=>{
    res.send("Backend API Running");
});

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});