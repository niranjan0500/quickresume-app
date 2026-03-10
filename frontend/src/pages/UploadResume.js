import React, { useState } from "react";
import API from "../services/api";

function UploadResume() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [file,setFile] = useState(null);

  const handleUpload = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("name",name);
    formData.append("email",email);
    formData.append("resume",file);

    try{

      const token = localStorage.getItem("token");

      await API.post("/resumes/upload",formData,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      alert("Resume uploaded successfully");

    }catch(err){

      console.log(err);
      alert("Upload failed");

    }

  };

  return (

    <div>

      <h2>Upload Resume</h2>

      <form onSubmit={handleUpload}>

        <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />

        <br/><br/>

        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />

        <br/><br/>

        <input
        type="file"
        onChange={(e)=>setFile(e.target.files[0])}
        />

        <br/><br/>

        <button type="submit">Upload Resume</button>

      </form>

    </div>

  );

}

export default UploadResume;