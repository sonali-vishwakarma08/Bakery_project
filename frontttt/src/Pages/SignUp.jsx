import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/^\S*$/, "No spaces allowed"),
      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: (values, { resetForm }) => {
      const stored = JSON.parse(localStorage.getItem("the-velvet-delights")) || {
        userdetails: {},
        cart: {},
        wishlist: {},
      };

      stored.userdetails = {
        name: values.name,
        email: values.email,
        password: values.password,
        loggedIn: false,
      };

      localStorage.setItem("the-velvet-delights", JSON.stringify(stored));
      toast.success("Registration successful!");
      resetForm();
      setTimeout(() => navigate("/login"), 1000);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fdf1f0] px-4 sm:px-6 lg:px-12">
      <ToastContainer position="top-center" autoClose={1500} />
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#D9077A] mb-6">Register</h2>
        <form onSubmit={formik.handleSubmit}>
          {["name", "email", "password", "confirmPassword"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-gray-700 font-medium mb-2 capitalize">{field}</label>
              <input
                type={field.includes("password") ? "password" : "text"}
                name={field}
                placeholder={`Enter your ${field}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9077A]"
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
            disabled={formik.isSubmitting}
            className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-3 rounded-full mt-4 font-medium hover:opacity-90 transition"
          >
            Register
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
