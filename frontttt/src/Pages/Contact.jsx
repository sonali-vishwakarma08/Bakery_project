import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { feedbackService } from "../services/apiService";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formik = useFormik({
    initialValues: { name: "", email: "", subject: "", message: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      subject: Yup.string().required("Subject is required"),
      message: Yup.string().min(10, "Message must be at least 10 characters").required("Message is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsSubmitting(true);
        await feedbackService.submitContactForm(values);
        toast.success("Message sent successfully! We'll get back to you soon.");
        resetForm();
      } catch (err) {
        console.error(err);
        toast.error("Failed to send message. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div>
      <Header />
      <ToastContainer position="top-center" autoClose={3000} />
      
      {/* Contact Information Section */}
      <div className="bg-[#fdf1f0] pt-24 pb-12 px-4 sm:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-block bg-gradient-to-br from-[#D9526B] to-[#F2BBB6] p-4 rounded-full mb-4">
              <FaPhone className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Call Us</h3>
            <p className="text-gray-600">+1 (555) 123-4567</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-block bg-gradient-to-br from-[#D9526B] to-[#F2BBB6] p-4 rounded-full mb-4">
              <FaEnvelope className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Us</h3>
            <p className="text-gray-600">support@bakery.com</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-block bg-gradient-to-br from-[#D9526B] to-[#F2BBB6] p-4 rounded-full mb-4">
              <FaMapMarkerAlt className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Visit Us</h3>
            <p className="text-gray-600">123 Bakery Street, City, State</p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="flex items-center justify-center min-h-screen bg-[#fdf1f0] px-4 sm:px-6 lg:px-12 py-12">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#D9077A] mb-2">
            Get in Touch
          </h2>
          <p className="text-center text-gray-600 mb-8">We'd love to hear from you. Send us a message!</p>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9526B] transition"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                ) : null}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9526B] transition"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="What is this about?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9526B] transition"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subject}
              />
              {formik.touched.subject && formik.errors.subject ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.subject}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea
                name="message"
                placeholder="Tell us more about your inquiry..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9526B] transition resize-none"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
              />
              {formik.touched.message && formik.errors.message ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.message}</div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || formik.isSubmitting}
              className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white cursor-pointer py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50 shadow-lg"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
export default Contact;
