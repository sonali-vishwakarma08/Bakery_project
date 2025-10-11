import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", formData);
    toast.success("Thank you for your feedback!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-8 md:p-12">
          <h2 className="text-3xl font-bold text-[#D9526B] mb-6 text-center">
            We Value Your Feedback
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Let us know how we can improve your experience!
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D9526B] transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D9526B] transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D9526B] transition resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white font-medium rounded-full px-6 py-3 hover:opacity-90 transition"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
