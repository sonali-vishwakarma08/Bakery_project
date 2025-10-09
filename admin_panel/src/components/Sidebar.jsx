import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart2,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const [openCustomers, setOpenCustomers] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  const isActive = (path) =>
    location.pathname === path ? "bg-pink-500 text-white" : "text-gray-700";

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col justify-between h-screen">
      {/* Logo Section */}
      <div>
        <div className="flex items-center justify-between p-4 shadow-md border border-white">
          <div className="flex items-center space-x-2">
            <div className="bg-pink-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center">
              BK
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Bekery</h1>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-600 hover:text-pink-500"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 text-sm">
          <Link
            to="/"
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-pink-100 ${isActive(
              "/"
            )}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/orders"
            className={`flex items-center justify-between p-3 rounded-lg hover:bg-pink-100 ${isActive(
              "/orders"
            )}`}
          >
            <div className="flex items-center space-x-3">
              <ShoppingBag size={18} />
              <span>Orders</span>
            </div>
            <span className="bg-pink-500 text-white text-xs rounded-full px-2 py-0.5">
              25
            </span>
          </Link>

          <div
            onClick={() => setOpenCustomers(!openCustomers)}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-pink-100 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Users size={18} />
              <span>Customers</span>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                openCustomers ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown */}
          {openCustomers && (
            <div className="ml-8 mt-1 space-y-1 text-gray-600">
              <Link
                to="/customers/add"
                className="block hover:text-pink-500 transition"
              >
                Add New
              </Link>
              <Link
                to="/customers/members"
                className="block hover:text-pink-500 transition"
              >
                Members
              </Link>
              <Link
                to="/customers/general"
                className="block hover:text-pink-500 transition"
              >
                General Customers
              </Link>
            </div>
          )}

          <Link
            to="/analytics"
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-pink-100 ${isActive(
              "/analytics"
            )}`}
          >
            <BarChart2 size={18} />
            <span>Analytics</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Card */}
      <div className="p-4">
        <div className="bg-pink-50 p-4 rounded-2xl text-center shadow-sm">
          <img
            src="https://cdn-icons-png.flaticon.com/512/857/857681.png"
            alt="menu"
            className="w-10 h-10 mx-auto mb-2"
          />
          <p className="text-gray-600 text-xs mb-2">
            Organize your menus <br /> through button below
          </p>
          <button className="bg-pink-500 text-white text-xs px-4 py-1 rounded-full hover:bg-pink-600 transition">
            + Add Menu
          </button>
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-3">
          The Velvet Delight Admin Dashboard
          <br />© 2024 All Rights Reserved
        </p>
      </div>
    </aside>
  );
}
