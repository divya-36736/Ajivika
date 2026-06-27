


import Map from "./components/map.jsx";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Form from "./components/form.jsx";
import Register from "./components/register.jsx";
import HierForm from "./components/hierForm.jsx";
import React, { useEffect, useState } from "react";
import Login from "./components/login.jsx";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase auth listener ki jagah LocalStorage se user fetch karein
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route exact path="/" element={<Map />} />
          <Route exact path="/form" element={<Form />} />
          
          {/* Auth Routes: Agar user logged in hai toh seedha admin dashboard par bhejein */}
          <Route exact path="/login" element={user ? <Navigate to="/admin" /> : <Login />} />
          <Route exact path="/register" element={user ? <Navigate to="/admin" /> : <Register />} />
          
          {/* Protected Route: Admin page sirf tabhi khulega jab user logged in ho */}
          <Route exact path="/admin" element={user ? <HierForm /> : <Navigate to="/login" />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;