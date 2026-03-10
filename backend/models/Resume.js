const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({

 name:{
  type:String,
  required:true
 },

 email:{
  type:String,
  required:true
 },

 resume:{
  type:String,
  required:true
 }

});

module.exports = mongoose.model("Resume", ResumeSchema);