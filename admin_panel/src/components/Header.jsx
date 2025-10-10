import React, { useState } from "react";
import {
  FaBell,
  FaCog,
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    setMenuOpen(false);
    navigate("/settings");
  };

  const handleLogout = () => {
    setMenuOpen(false);
    alert("Logged out");
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between relative h-14">
      {/* Left - Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-700 text-xl focus:outline-none"
        >
          <FaBars />
        </button>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Welcome, Admin
        </h1>
      </div>

      {/* Right - Icons + Profile */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-4">
          <FaBell className="text-gray-600 text-lg cursor-pointer" />
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="profile"
              className="w-8 h-8 rounded-full border border-gray-300"
            />
            <span className="hidden sm:inline text-gray-700 font-medium">
              Admin
            </span>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleProfileClick}
              >
                <FaUserCircle /> Profile
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleSettingsClick}
              >
                <FaCog /> Settings
              </button>
              <hr />
              <button
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
