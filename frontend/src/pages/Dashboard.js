import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard(){

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  return(

    <div>

      <h2>Dashboard</h2>

      <button onClick={logout}>Logout</button>

      <br/><br/>

      <div style={{display:"flex",gap:"40px"}}>

        <div style={{border:"1px solid black",padding:"30px"}}>

          <h3>Upload Resume</h3>

          <button onClick={()=>navigate("/upload")}>
            Upload
          </button>

        </div>

        <div style={{border:"1px solid black",padding:"30px"}}>

          <h3>View Resumes</h3>

          <button onClick={()=>navigate("/resumes")}>
            View
          </button>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;