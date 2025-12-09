import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3).required("Name required"),
      email: Yup.string().email().required("Email required"),
      password: Yup.string().min(6).required("Password required"),
    }),
    onSubmit: async (values) => {
      try {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        await updateProfile(userCred.user, {
          displayName: values.name,
        });

        await setDoc(doc(db, "users", userCred.user.uid), {
          uid: userCred.user.uid,
          name: values.name,
          email: values.email,
          wishlist: [],
          createdAt: new Date(),
        });
        toast.success("Signup Success! Please login.", {
          onClose: () => navigate("/login"),
        });
      } catch (err) {
        toast.error("Registration failed: " + err.message);
      }
    },
  });

  const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        wishlist: [],
        createdAt: new Date(),
      });

      toast.success("Signup Success! Please login.", {
        onClose: () => navigate("/login"),
      });
    } catch (error) {
      toast.error("Google Sign-Up Failed: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fdf1f0] px-6">
      <div className="bg-white w-full max-w-[470px] rounded-xl shadow-lg p-8">
        <form onSubmit={formik.handleSubmit}>
          <h1 className="text-center font-bold text-3xl text-[#D9077A] mb-6">
            Create Account
          </h1>

          <input
            type="text"
            placeholder="Enter Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9077A] outline-none"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}

          <input
            type="email"
            placeholder="Enter Email"
            className="w-full px-4 py-2 mt-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9077A] outline-none"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}

          <div className="relative mt-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9077A] outline-none"
              {...formik.getFieldProps("password")}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-[#D9077A]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash size={20} />
              ) : (
                <IoEyeSharp size={22} />
              )}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-3 rounded-full font-medium hover:opacity-90 transition mt-6 cursor-pointer"
          >
            Sign Up
          </button>

          <div
            onClick={signUpWithGoogle}
            className="flex gap-2 border mt-5 rounded-full py-2 justify-center items-center cursor-pointer hover:bg-gray-100 outline-none border-gray-300"
          >
            <FcGoogle size={24} />
            <span className="text-[#D9077A] font-semibold">
              Sign Up With Google
            </span>
          </div>

          <p className="text-center text-gray-700 mt-5">
            Already a user?{" "}
            <Link
              to="/login"
              className="text-[#D9077A] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default SignUp;
