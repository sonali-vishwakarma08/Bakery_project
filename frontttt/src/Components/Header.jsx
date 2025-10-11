import React, { useState, useEffect } from "react";
import { FaUserAlt, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();

  const updateState = () => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {
      userdetails: {},
      wishlist: {},
    };
    setIsLoggedIn(data.userdetails?.loggedIn || false);
    setWishlistCount(Object.keys(data.wishlist || {}).length);
  };

  useEffect(() => {
    updateState();
    const handleStorageChange = () => updateState();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {};
    data.userdetails = { loggedIn: false };
    data.cart = {};
    data.wishlist = {};
    localStorage.setItem("the-velvet-delights", JSON.stringify(data));
    setIsLoggedIn(false);
    setWishlistCount(0);
    navigate("/");
  };

  return (
    <header className="bg-[#FAF9EE] fixed top-0 left-0 w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="The Velvet Delights"
              className="w-auto h-12 lg:h-15"
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-[#D9526B] hover:text-[#c13f5e] font-medium transition"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-[#c13f5e] font-medium transition"
            >
              About
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-[#c13f5e] font-medium transition"
            >
              Products
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-[#c13f5e] font-medium transition"
            >
              Contact
            </Link>
             <Link
              to="/feedback"
              className="text-gray-700 hover:text-[#c13f5e] font-medium transition"
            >
              Feedback
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <FaUserAlt
              className="text-gray-700 cursor-pointer hover:text-[#D9526B] transition"
              size={22}
              onClick={() => navigate("/profile")}
            />
            <FaShoppingCart
              onClick={() => navigate("/cart")}
              className="text-gray-700 cursor-pointer hover:text-[#D9526B] transition"
              size={22}
            />
            <div className="relative">
              <FaHeart
                onClick={() => navigate("/wishlist")}
                className="cursor-pointer transition text-[#D9526B]"
                size={22}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] hover:opacity-90 text-white font-medium rounded-full px-5 py-2 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] hover:opacity-90 text-white font-medium rounded-full px-5 py-2 transition"
              >
                Login
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#FAF9EE] shadow-md rounded-b-lg mt-2 py-4 px-6 space-y-4 animate-slide-down">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block text-[#D9526B] hover:text-[#c13f5e] font-medium transition"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-[#c13f5e] font-medium transition"
            >
              About
            </Link>
            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-[#c13f5e] font-medium transition"
            >
              Products
            </Link>
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-[#c13f5e] font-medium transition"
            >
              Contact
            </Link>

            <div className="flex items-center space-x-4 mt-2">
              <FaUserAlt
                className="text-gray-700 cursor-pointer hover:text-[#D9526B] transition"
                size={22}
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
              />
              <FaShoppingCart
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/cart");
                }}
                className="text-gray-700 cursor-pointer hover:text-[#D9526B] transition"
                size={22}
              />
              <div className="relative">
                <FaHeart
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/wishlist");
                  }}
                  className="cursor-pointer transition text-[#D9526B]"
                  size={22}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] hover:opacity-90 text-white font-medium rounded-full px-5 py-2 transition"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] hover:opacity-90 text-white font-medium rounded-full px-5 py-2 transition"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
