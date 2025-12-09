import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { API_ENDPOINTS } from "../config/apiConfig";

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/^\S*$/, "No spaces allowed"),
      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            phone: values.phone,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
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

        toast.success(data.message || "Registration successful!");
        resetForm();
        setTimeout(() => navigate("/"), 1000);
      } catch (error) {
        console.error("Registration error:", error);
        toast.error(error.message || "Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fdf1f0] px-4 sm:px-6 lg:px-12">
      <ToastContainer position="top-center" autoClose={1500} />
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#D9077A] mb-6">Register</h2>
        <form onSubmit={formik.handleSubmit}>
          {["name", "email", "phone", "password", "confirmPassword"].map((field) => {
            const isPasswordField = field === "password";
            const isConfirmPasswordField = field === "confirmPassword";
            const isPasswordType = isPasswordField || isConfirmPasswordField;
            const showPasswordValue = isPasswordField ? showPassword : showConfirmPassword;
            const setShowPasswordValue = isPasswordField ? setShowPassword : setShowConfirmPassword;

            return (
              <div className="mb-4" key={field}>
                <label className="block text-gray-700 font-medium mb-2 capitalize">
                  {field === "confirmPassword" ? "Confirm Password" : field}
                </label>
                <div className="relative">
                  <input
                    type={
                      isPasswordType
                        ? showPasswordValue
                          ? "text"
                          : "password"
                        : field === "phone"
                        ? "tel"
                        : "text"
                    }
                    name={field}
                    placeholder={
                      field === "phone"
                        ? "Enter your 10-digit phone number (e.g., 1234567890)"
                        : `Enter your ${field === "confirmPassword" ? "confirm password" : field}`
                    }
                    maxLength={field === "phone" ? 10 : undefined}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9077A]"
                    onChange={(e) => {
                      // Only allow numbers for phone field
                      if (field === "phone") {
                        const value = e.target.value.replace(/\D/g, "");
                        formik.setFieldValue("phone", value);
                      } else {
                        formik.handleChange(e);
                      }
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values[field]}
                  />
                  {isPasswordType && (
                    <button
                      type="button"
                      onClick={() => setShowPasswordValue(!showPasswordValue)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPasswordValue ? (
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
            );
          })}
          <button
            type="submit"
            disabled={loading || formik.isSubmitting}
            className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-3 rounded-full mt-4 font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#D9077A] font-medium hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
