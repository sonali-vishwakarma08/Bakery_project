import React from "react";
import { FaBell, FaEnvelope, FaShoppingCart, FaCog, FaSearch } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Left - Logo/Title */}
      <div className="text-2xl font-bold text-gray-800">Analytics</div>

      {/* Center - Search Bar */}
      <div className="flex-1 mx-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search here"
            className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Right - Icons + User */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <FaBell className="text-gray-600 text-xl cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">12</span>
        </div>

        <div className="relative">
          <FaEnvelope className="text-gray-600 text-xl cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-1">5</span>
        </div>

        <div className="relative">
          <FaShoppingCart className="text-gray-600 text-xl cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-1">2</span>
        </div>

        <FaCog className="text-gray-600 text-xl cursor-pointer" />

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
    </header>
  );
}
