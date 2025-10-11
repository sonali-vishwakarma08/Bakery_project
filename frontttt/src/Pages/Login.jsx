import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email required"),
      password: Yup.string().required("Password required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const stored = JSON.parse(localStorage.getItem("the-velvet-delights")) || {
        userdetails: {},
        cart: {},
        wishlist: {},
      };

      const user = stored.userdetails;

      if (user.email === values.email && user.password === values.password) {
        stored.userdetails.loggedIn = true;
        localStorage.setItem("the-velvet-delights", JSON.stringify(stored));
        toast.success("Login successful!");
        resetForm();
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error("Invalid email or password!");
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
              <input
                type={field}
                name={field}
                placeholder={`Enter your ${field}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9077A]"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[field]}
              />
              {formik.touched[field] && formik.errors[field] && (
                <div className="text-red-500 text-sm mt-1">{formik.errors[field]}</div>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-3 rounded-full font-medium hover:opacity-90 transition"
          >
            Login
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
