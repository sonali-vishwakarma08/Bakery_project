import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function Contact() {
  const formik = useFormik({
    initialValues: { name: "", email: "", message: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      toast.success("Message sent successfully!");
      resetForm();
    },
  });

  return (
    <div><Header/>
    <div className="flex items-center justify-center min-h-screen bg-[#fdf1f0] px-4 sm:px-6 lg:px-12 mt-16">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#D9077A] mb-6">
          Contact Us
        </h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9077A]"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
            ) : null}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9077A]"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Message</label>
            <textarea
              name="message"
              placeholder="Write your message"
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9077A]"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyDown={(e)=>{
                if(e.key === "Enter"){
                  e.preventDefault();
                   formik.handleSubmit();
                }
              }}
              value={formik.values.message}
            />
            {formik.touched.message && formik.errors.message ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.message}</div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white cursor-pointer py-3 rounded-full mt-4 font-medium hover:opacity-90 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
    <Footer/>
    </div>
  );
}
export default Contact;
