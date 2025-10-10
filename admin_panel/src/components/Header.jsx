import React, { useState } from "react";
import {
  FaBell,
  FaEnvelope,
  FaShoppingCart,
  FaCog,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Header({ onMenuClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md px-4 sm:px-6 py-3 flex items-center justify-between relative">
      {/* Left - Sidebar Toggle + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-700 text-xl focus:outline-none"
        >
          <FaBars />
        </button>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Analytics
        </h1>
      </div>

      {/* Center - Search Bar */}
      <div className="hidden sm:flex flex-1 mx-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search here"
            className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Right - Desktop Icons */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="relative">
          <FaBell className="text-gray-600 text-lg cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1">
            12
          </span>
        </div>

        <div className="relative">
          <FaEnvelope className="text-gray-600 text-lg cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] rounded-full px-1">
            5
          </span>
        </div>

        <div className="relative">
          <FaShoppingCart className="text-gray-600 text-lg cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] rounded-full px-1">
            2
          </span>
        </div>

        <FaCog className="text-gray-600 text-lg cursor-pointer" />

        {/* User */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="user"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="text-gray-800 text-sm font-medium">
            Brian Lee <span className="text-gray-400 block text-xs">Admin</span>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-gray-600 text-xl focus:outline-none"
      >
        {menuOpen ? <FaTimes /> : <FaCog />}
      </button>

      {menuOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex flex-col space-y-3 md:hidden z-50">
          <div className="flex justify-between items-center">
            <FaBell className="text-gray-600" />
            <FaEnvelope className="text-gray-600" />
            <FaShoppingCart className="text-gray-600" />
            <FaCog className="text-gray-600" />
          </div>
          <div className="border-t border-gray-100 pt-2 flex items-center space-x-2">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="user"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-gray-800 text-sm font-medium">Brian Lee</p>
              <p className="text-gray-400 text-xs">Admin</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
