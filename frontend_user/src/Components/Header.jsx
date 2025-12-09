import React, { useState, useEffect, useRef } from "react";
import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);

      const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {
        wishlist: {},
      };
      setWishlistCount(Object.keys(data.wishlist || {}).length);
    });
    return () => unsubscribe();
  }, []);

  const handleLogoutConfirm = async () => {
    await signOut(auth);

    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {};
    data.wishlist = {};
    data.cart = {};
    localStorage.setItem("the-velvet-delights", JSON.stringify(data));

    setIsLoggedIn(false);
    setWishlistCount(0);
    setUserMenuOpen(false);
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleClickLogout = () => {
    setUserMenuOpen(false);
    setShowLogoutModal(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className={showLogoutModal ? "blur-sm" : ""}>
        <header className="bg-[#FAF9EE] fixed top-0 left-0 w-full z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between h-16">
              <img src="/logo.png" alt="TV Delights" className="h-12" />

              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  to="/"
                  className="text-[#D9526B] font-medium hover:text-[#c13f5e] transition"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 font-medium hover:text-[#c13f5e] transition"
                >
                  About
                </Link>
                <Link
                  to="/products"
                  className="text-gray-700 font-medium hover:text-[#c13f5e] transition"
                >
                  Products
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 font-medium hover:text-[#c13f5e] transition"
                >
                  Contact
                </Link>
                <Link
                  to="/feedback"
                  className="text-gray-700 font-medium hover:text-[#c13f5e] transition"
                >
                  Feedback
                </Link>
              </nav>

              <div
                className="hidden md:flex items-center space-x-4 relative"
                ref={userMenuRef}
              >
                <FaUserAlt
                  size={22}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="cursor-pointer text-gray-700 hover:text-[#D9526B] transition"
                />

                {userMenuOpen && (
                  <div
                    className={`absolute right-0 w-48 bg-white shadow-lg rounded-lg py-2 z-50
                    ${isLoggedIn ? "mt-56" : "mt-36"}`}
                  >
                    {!isLoggedIn ? (
                      <>
                        <button
                          className="block px-4 py-2 w-full text-left text-[#D9526B] hover:bg-gray-100"
                          onClick={() => navigate("/login")}
                        >
                          Login
                        </button>
                        <button
                          className="block px-4 py-2 w-full text-left text-[#D9526B] hover:bg-gray-100"
                          onClick={() => navigate("/signup")}
                        >
                          Sign Up
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                          onClick={() => navigate("/profile")}
                        >
                          My Profile
                        </button>
                        <button
                          className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                          onClick={() => navigate("/orders")}
                        >
                          Orders
                        </button>
                        <button
                          className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                          onClick={() => navigate("/wishlist")}
                        >
                          Wishlist
                        </button>
                        <button
                          className="block px-4 py-2 w-full text-left text-red-500 hover:bg-gray-100"
                          onClick={handleClickLogout}
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </div>
                )}

                <FaShoppingCart
                  size={22}
                  onClick={() => navigate("/cart")}
                  className="cursor-pointer text-gray-700 hover:text-[#D9526B] transition"
                />

                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D9526B] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>

              <button
                className="md:hidden text-gray-700"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex justify-center items-center backdrop-blur-2xl bg-opacity-40">
          <div className="bg-white rounded-2xl p-6 w-80 text-center shadow-xl">
            <h2 className="text-lg font-semibold text-[#D9526B] mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleLogoutConfirm}
                className="bg-[#D9526B] text-white px-5 py-2 rounded-full hover:opacity-90 transition w-[100px] cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="border border-[#D9526B] text-[#D9526B] px-5 py-2 rounded-full hover:bg-[#fbe9e7] transition w-[100px] cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
