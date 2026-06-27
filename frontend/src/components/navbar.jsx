import React, { useEffect, useState } from "react";
import API from "../api/axios"; // Firebase hatakar custom API (Axios) import kiya

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase auth listener ki jagah LocalStorage check karein
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // [] ka matlab ye sirf ek baar load hone par chalega

  async function handleLogout() {
    try {
      // 1. Backend ko batao ki user logout ho raha hai (token blacklist karne ke liye)
      await API.get("/auth/logout");
      
      // 2. Frontend se user ka data delete karo
      localStorage.removeItem("user");
      
      // 3. State update karo aur login page par bhej do
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  return (
    <div className="bg-gray-500 text-white text-center flex w-full">
      <div className="flex justify-center ml-36 p-4 font-bold text-3xl text-white w-[90vw]">
        <a href="/">AJIVIKA</a>
      </div>
      <div className="pt-5">
        {user ? (
          <button
            className="border mr-12 border-solid rounded-md h-2/3 px-3 bg-gray-800 hover:bg-gray-900 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <a href="/login">
            <button className="border mr-12 border-solid rounded-md h-2/3 px-3 bg-gray-700 hover:bg-gray-800 transition">
              Admin
            </button>
          </a>
        )}
      </div>
    </div>
  );
}