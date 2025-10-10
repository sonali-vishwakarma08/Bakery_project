import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  FolderTree,
  Package,
  CreditCard,
  MessageSquare,
  Image,
  Tag,
  FileText,
} from "lucide-react";
import { FaBars } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ collapsed, toggleSidebar }) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-pink-500 text-white"
      : "text-gray-700 hover:bg-pink-100";

  return (
    <aside
      className={`flex flex-col justify-between h-full border-r border-gray-100 bg-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* ─── Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between p-2 border-b border-gray-100 bg-pink-50">
        <div className="flex items-center space-x-2">
          <div className="bg-pink-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center">
            BK
          </div>
          {!collapsed && (
            <h1 className="text-base font-semibold text-gray-800">Bakery</h1>
          )}
        </div>

        {/* Toggle */}
        <button
          onClick={toggleSidebar}
          className="text-gray-600 text-lg p-1 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* ─── Menu Items ───────────────────────────────────────── */}
      <nav className="flex-1 p-2 space-y-0.5 text-[15px]">
        {/* Dashboard */}
        <Link
          to="/"
          className={`flex items-center gap-2.5 p-2 rounded-md transition-all duration-200 ${isActive(
            "/"
          )} ${collapsed ? "justify-center" : ""}`}
        >
          <LayoutDashboard size={18} />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        {/* Category */}
        <Link
          to="/category"
          className={`flex items-center gap-2.5 p-2 rounded-md transition-all duration-200 ${isActive(
            "/category"
          )} ${collapsed ? "justify-center" : ""}`}
        >
          <FolderTree size={18} />
          {!collapsed && <span>Category</span>}
        </Link>

        {/* Subcategory */}
        <Link
          to="/subcategory"
          className={`flex items-center gap-2.5 p-2 rounded-md transition-all duration-200 ${isActive(
            "/subcategory"
          )} ${collapsed ? "justify-center" : ""}`}
        >
          <FolderTree size={18} />
          {!collapsed && <span>Subcategory</span>}
        </Link>

        {/* Products */}
        <Link
          to="/products"
          className={`flex items-center gap-2.5 p-2 rounded-md transition-all duration-200 ${isActive(
            "/products"
          )} ${collapsed ? "justify-center" : ""}`}
        >
          <Package size={18} />
          {!collapsed && <span>Products</span>}
        </Link>

        {/* Customers */}
        <Link
          to="/customers"
          className={`flex items-center gap-2.5 p-2 rounded-md transition-all duration-200 ${isActive(
            "/customers"
          )} ${collapsed ? "justify-center" : ""}`}
        >
          <Users size={18} />
          {!collapsed && <span>Customers</span>}
        </Link>

        {/* Orders */}
        <Link
          to="/orders"
          className={`flex items-center gap-2.5 p-2 rounded-md transition-all duration-200 ${isActive(
            "/orders"
          )} ${collapsed ? "justify-center" : ""}`}
        >
          <ShoppingBag size={18} />
          {!collapsed && <span>Orders</span>}
        </Link>

        {/* Payments */}
        <Link
          to="/payments"
          className={`flex items-center gap-2.5 p-2 rounded-md transition-all duration-200 ${isActive(
            "/payments"
          )} ${collapsed ? "justify-center" : ""}`}
        >
          <CreditCard size={18} />
          {!collapsed && <span>Payments</span>}
        </Link>

        {/* Feedback */}
        <Link
          to="/feedback"
          className={`flex items-center gap-2.5 p-2 rounded-md transition-all duration-200 ${isActive(
            "/feedback"
          )} ${collapsed ? "justify-center" : ""}`}
        >
          <MessageSquare size={18} />
          {!collapsed && <span>Feedback</span>}
        </Link>

        {/* Banner */}
        <Link
          to="/banner"
          className={`flex items-center gap-2.5 p-2 rounded-md transition-all duration-200 ${isActive(
            "/banner"
          )} ${collapsed ? "justify-center" : ""}`}
        >
          <Image size={18} />
          {!collapsed && <span>Banner</span>}
        </Link>

        {/* Promo Code */}
        <Link
          to="/promocode"
          className={`flex items-center gap-2.5 p-2 rounded-md transition-all duration-200 ${isActive(
            "/promocode"
          )} ${collapsed ? "justify-center" : ""}`}
        >
          <Tag size={18} />
          {!collapsed && <span>Promo Code</span>}
        </Link>

        {/* Reports */}
        <Link
          to="/reports"
          className={`flex items-center gap-2.5 p-2 rounded-md transition-all duration-200 ${isActive(
            "/reports"
          )} ${collapsed ? "justify-center" : ""}`}
        >
          <FileText size={18} />
          {!collapsed && <span>Reports</span>}
        </Link>
      </nav>
    </aside>
  );
}
