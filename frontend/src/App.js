import ProtectedRoute from "./components/ProtectedRoute";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import ResumesList from "./pages/ResumesList";

function App() {
  return (
    <BrowserRouter>

      <h1>Resume Builder</h1>

      <Routes>

        <Route path="/" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route
path="/dashboard"
element={
<ProtectedRoute>
<Dashboard />
</ProtectedRoute>
}
/>

        <Route
path="/upload"
element={
<ProtectedRoute>
<UploadResume />
</ProtectedRoute>
}
/>

<Route
path="/resumes"
element={
<ProtectedRoute>
<ResumesList />
</ProtectedRoute>
}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;