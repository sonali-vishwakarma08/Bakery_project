import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { API_ENDPOINTS } from "../config/apiConfig";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email required"),
      password: Yup.string().required("Password required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Update the-velvet-delights localStorage for backward compatibility
        const stored = JSON.parse(localStorage.getItem("the-velvet-delights")) || {
          userdetails: {},
          cart: {},
          wishlist: {},
        };
        stored.userdetails = {
          ...data.user,
          loggedIn: true,
        };
        localStorage.setItem("the-velvet-delights", JSON.stringify(stored));

        toast.success(data.message || "Login successful!");
        resetForm();
        setTimeout(() => navigate("/"), 1000);
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Invalid email or password!");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fdf1f0] px-6">
      <ToastContainer position="top-center" autoClose={1500} />
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-[#D9077A] mb-6">Login</h2>
        <form onSubmit={formik.handleSubmit}>
          {["email", "password"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-gray-700 font-medium mb-2 capitalize">{field}</label>
              <div className="relative">
                <input
                  type={field === "password" ? (showPassword ? "text" : "password") : field}
                  name={field}
                  placeholder={`Enter your ${field}`}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9077A] focus:outline-none"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field]}
                />
                {field === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
              {formik.touched[field] && formik.errors[field] && (
                <div className="text-red-500 text-sm mt-1">{formik.errors[field]}</div>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-3 rounded-full font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center text-gray-600 mt-4">
            New user?{" "}
            <Link to="/signup" className="text-[#D9077A] hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
