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
  Truck,
} from "lucide-react";
import { FaBars } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ collapsed, toggleSidebar }) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-pink-500 text-white"
      : "text-gray-700 hover:bg-pink-100";

  const menuItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/category", label: "Category", icon: FolderTree },
    { to: "/subcategory", label: "Subcategory", icon: FolderTree },
    { to: "/products", label: "Products", icon: Package },
    { to: "/customers", label: "Customers", icon: Users },
    { to: "/orders", label: "Orders", icon: ShoppingBag },
    { to: "/delivery-staff", label: "Delivery Staff", icon: Truck },
    { to: "/payments", label: "Payments", icon: CreditCard },
    { to: "/feedback", label: "Feedback", icon: MessageSquare },
    { to: "/banner", label: "Banner", icon: Image },
    { to: "/promocode", label: "Promo Code", icon: Tag },
    { to: "/reports", label: "Reports", icon: FileText },
  ];

  return (
    <div
      className={`flex flex-col justify-between h-full bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ${
        collapsed ? "w-16" : "w-[220px]"
      }`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-2 border-b border-gray-100 bg-pink-50">
        <div className="flex items-center space-x-2">
          <div className="bg-pink-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
            BK
          </div>
          {!collapsed && (
            <h1 className="text-base font-semibold text-gray-800">Bakery</h1>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="text-gray-600 text-lg p-1 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2 space-y-0.5 text-[15px]">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-2.5 p-2 rounded-md transition-all duration-200 ${isActive(
              item.to
            )} ${collapsed ? "justify-center" : ""}`}
          >
            <item.icon size={18} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}