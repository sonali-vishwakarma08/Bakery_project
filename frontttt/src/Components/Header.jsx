import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaUserAlt, FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { Bell } from 'lucide-react';
import '../styles/NotificationCenter.css'; // Import the notification styles
import logo from "../assets/images/logo.png";

export default function Header({ cart = [], wishlist = [] }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false); // Added state for notifications
  const [notifications, setNotifications] = useState([]); // Added state for notification data
  const [unreadCount, setUnreadCount] = useState(0); // Added state for unread count
  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null); // Added ref for notifications dropdown
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      // Close notifications dropdown when clicking outside
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) return;

      const response = await fetch('http://localhost:5000/api/notifications/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.notifications) {
          setNotifications(data.notifications);
          // Count unread notifications
          const unread = data.notifications.filter(n => !n.is_read).length;
          setUnreadCount(unread);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch notifications from backend (similar to NotificationCenter component)
  useEffect(() => {
    // Fetch on component mount and when isLoggedIn changes
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  // Refresh notifications when dropdown is opened
  useEffect(() => {
    if (notificationsOpen && isLoggedIn) {
      fetchNotifications();
    }
  }, [notificationsOpen, isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    navigate("/");
  };

  // Get total quantity of items in cart
  const cartQuantity = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) return;

      const response = await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // No body needed, will mark all user notifications as read
      });

      if (response.ok) {
        // Update local state
        setNotifications([]);
        setUnreadCount(0);
        setNotificationsOpen(false);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link
              to="/"
              className={`hover:text-[#D9526B] transition ${
                location.pathname === "/" ? "text-[#D9526B] font-medium" : "text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`hover:text-[#D9526B] transition ${
                location.pathname === "/products" ? "text-[#D9526B] font-medium" : "text-gray-700"
              }`}
            >
              Products
            </Link>
            <Link
              to="/custom-cake"
              className={`hover:text-[#D9526B] transition ${
                location.pathname === "/custom-cake" ? "text-[#D9526B] font-medium" : "text-gray-700"
              }`}
            >
              Custom Cake
            </Link>
            <Link
              to="/about"
              className={`hover:text-[#D9526B] transition ${
                location.pathname === "/about" ? "text-[#D9526B] font-medium" : "text-gray-700"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`hover:text-[#D9526B] transition ${
                location.pathname === "/contact" ? "text-[#D9526B] font-medium" : "text-gray-700"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <Link to="/wishlist" className="relative text-gray-700 hover:text-[#D9526B] transition">
              <FaHeart size={22} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D9526B] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-gray-700 hover:text-[#D9526B] transition">
              <FaShoppingCart size={22} />
              {cartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D9526B] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartQuantity}
                </span>
              )}
            </Link>

            {/* Notification Bell Icon */}
            {isLoggedIn && (
              <div className="notification-center relative" ref={notificationsRef}>
                <button
                  className="notification-bell"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  title="Notifications"
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="notification-badge">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <>
                    <div className="notification-dropdown">
                      <div className="notification-header">
                        <h3>🔔 Notifications</h3>
                        <button 
                          className="close-btn"
                          onClick={() => setNotificationsOpen(false)}
                          title="Close"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="notification-list">
                        {notifications.length > 0 ? (
                          <>
                            {notifications.map((notification) => (
                              <div 
                                key={notification._id} 
                                className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                              >
                                <div className="notification-content">
                                  <div className="notification-icon">
                                    {notification.type === 'order' && '📦'}
                                    {notification.type === 'payment' && '💳'}
                                    {notification.type === 'delivery' && '🚚'}
                                    {notification.type === 'promo' && '🎉'}
                                    {notification.type === 'system' && '⚙️'}
                                  </div>
                                  <div className="notification-text">
                                    <p className="notification-title">{notification.title}</p>
                                    <p className="notification-body">{notification.message || notification.body}</p>
                                    <p className="notification-time">
                                      {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  className="close-notification"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    // Mark notification as read
                                    try {
                                      const authToken = localStorage.getItem('token');
                                      if (!authToken) return;

                                      const response = await fetch(`http://localhost:5000/api/notifications/${notification._id}`, {
                                        method: 'PUT',
                                        headers: {
                                          'Authorization': `Bearer ${authToken}`,
                                          'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ is_read: true })
                                      });

                                      if (response.ok) {
                                        // Update local state
                                        const updatedNotifications = notifications.filter(n => n._id !== notification._id);
                                        setNotifications(updatedNotifications);
                                        setUnreadCount(Math.max(0, unreadCount - 1));
                                      }
                                    } catch (error) {
                                      console.error('Error marking notification as read:', error);
                                    }
                                  }}
                                  title="Dismiss"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            <div className="p-2 border-t border-gray-200 text-center">
                              <button 
                                className="clear-all-btn"
                                onClick={markAllAsRead}
                              >
                                Clear All Notifications
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="empty-state">
                            <div>🔔</div>
                            <p>No notifications</p>
                            <p className="empty-subtitle">You're all caught up! 🎉</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div 
                      className="notification-backdrop"
                      onClick={() => setNotificationsOpen(false)}
                    ></div>
                  </>
                )}

              </div>
            )}

            <div className="relative" ref={profileDropdownRef}>
              <FaUserAlt
                className="text-gray-700 cursor-pointer hover:text-[#D9526B] transition"
                size={22}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              />
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/profile/info"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Profile Info
                      </Link>
                      <Link
                        to="/profile/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/profile/payments"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Payment History
                      </Link>
                      <Link
                        to="/profile/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Wishlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`py-2 hover:text-[#D9526B] transition ${
                  location.pathname === "/" ? "text-[#D9526B] font-medium" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`py-2 hover:text-[#D9526B] transition ${
                  location.pathname === "/products" ? "text-[#D9526B] font-medium" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/custom-cake"
                className={`py-2 hover:text-[#D9526B] transition ${
                  location.pathname === "/custom-cake" ? "text-[#D9526B] font-medium" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Custom Cake
              </Link>
              <Link
                to="/about"
                className={`py-2 hover:text-[#D9526B] transition ${
                  location.pathname === "/about" ? "text-[#D9526B] font-medium" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`py-2 hover:text-[#D9526B] transition ${
                  location.pathname === "/contact" ? "text-[#D9526B] font-medium" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}