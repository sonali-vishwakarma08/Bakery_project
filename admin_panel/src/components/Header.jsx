import React, { useState, useEffect, useRef } from "react";
import {
  FaBell,
  FaCog,
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllNotifications, markAsRead, markAllAsRead } from "../api/notificationApi";

export default function Header({ onMenuClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const notificationRef = useRef(null);

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
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getAllNotifications({ is_read: false });
      // Handle both array response and object with notifications property
      const notificationsData = Array.isArray(data) 
        ? data 
        : (data.notifications || []);
      const recentNotifications = notificationsData.slice(0, 5);
      setNotifications(recentNotifications);
      setUnreadCount(notificationsData.length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(user?._id);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleViewAll = () => {
    setNotificationOpen(false);
    navigate("/notifications");
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return notifDate.toLocaleDateString();
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
          Welcome, {user?.name || "Admin"}
        </h1>
      </div>

      {/* Right - Icons + Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative text-gray-600 hover:text-pink-500 transition"
          >
            <FaBell className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
              <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-pink-600 hover:text-pink-700 flex items-center gap-1"
                  >
                    <FaCheckDouble />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FaBell className="mx-auto text-4xl mb-2 text-gray-300" />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => handleMarkAsRead(notification._id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-800">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">
                              {formatTime(notification.createdAt)}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                              {notification.type}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification._id);
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          <FaCheck className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-2 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={handleViewAll}
                    className="w-full text-center text-sm text-pink-600 hover:text-pink-700 font-medium py-2"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            {user?.profile_image ? (
              <img
                src={`http://localhost:5000/uploads/users/${user.profile_image}`}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-gray-300 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
            )}
            <span className="hidden sm:inline text-gray-700 font-medium">
              {user?.name || "Admin"}
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
