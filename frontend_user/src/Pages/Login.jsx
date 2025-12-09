import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { auth , db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email Required"),
      password: Yup.string().required("Password Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        const res = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        const user = res.user;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          if (!userData.wishlist) {
            await updateDoc(userRef, {
              wishlist: [],
            });
          }
        }

        localStorage.setItem(
          "the-velvet-delights",
          JSON.stringify({
            user: {
              uid: user.uid,
              email: user.email,
              name: user.displayName || "User",
              loggedIn: true,
            },
          })
        );

        toast.success("Login Successful!", { autoClose: 1000 });

        resetForm();
        setTimeout(() => navigate("/"), 1200);
      } catch (err) {
        toast.error("Invalid Email or Password!");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fdf1f0] px-6">
      <ToastContainer position="top-center" autoClose={1200} />
      <div className="w-full max-w-[470px] bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-[#D9077A] mb-6">
          Login
        </h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9077A] outline-none"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9077A] outline-none"
              {...formik.getFieldProps("password")}
            />
            <span
              className="absolute right-3 top-10 cursor-pointer text-[#D9077A]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash size={20} />
              ) : (
                <IoEyeSharp size={22} />
              )}
            </span>

            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
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
