import React, { useEffect, useState } from "react";
import API from "../services/api";

function ResumesList(){

  const [resumes,setResumes] = useState([]);

  useEffect(()=>{
    fetchResumes();
  },[]);

  const fetchResumes = async ()=>{

    try{

      const token = localStorage.getItem("token");

      const data = await API.get("/resumes",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      setResumes(data.data);

    }catch(err){

      console.log(err);

    }

  };

  return(

    <div style={{padding:"40px"}}>

      <h2>Uploaded Resumes</h2>

      {resumes.length === 0 ? (

        <p>No resumes uploaded yet</p>

      ) : (

        resumes.map((resume)=>{

          return(

            <div 
            key={resume._id}
            style={{
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center",
              border:"1px solid #ccc",
              padding:"15px",
              marginTop:"10px",
              borderRadius:"5px"
            }}
            >

              <span>{resume.name}</span>

              <a
              href={`http://localhost:5000/api/resumes/download/${resume.resume.split("\\").pop()}`}
              target="_blank"
              rel="noreferrer"
              style={{
                background:"#007bff",
                color:"white",
                padding:"8px 15px",
                textDecoration:"none",
                borderRadius:"5px"
              }}
              >
              View Resume
              </a>

            </div>

          )

        })

      )}

    </div>

  )

}

export default ResumesList;