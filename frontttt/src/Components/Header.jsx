import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaUserAlt, FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import logo from "../assets/images/logo.png";

export default function Header({ cart = [], wishlist = [] }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileDropdownRef = useRef(null);
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    navigate("/");
  };

  // Get total quantity of items in cart
  const cartQuantity = cart.reduce((total, item) => total + (item.quantity || 1), 0);

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
}             </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}