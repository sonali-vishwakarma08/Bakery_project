import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";
import { feedbackService } from "../services/apiService";
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa";

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await feedbackService.submitFeedback(formData);
      toast.success("Thank you for your feedback! We appreciate your input.");
      setFormData({ name: "", email: "", rating: 5, message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#D9526B] mb-4">
              🙋 We Value Your Feedback!
            </h2>
            <p className="text-gray-600 text-lg mb-2">
              Help us improve by sharing your experience with us
            </p>
            <p className="text-gray-500">
              Your feedback helps us serve you better and create even more delicious treats!
            </p>
          </div>

          {/* Feedback Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D9526B] transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D9526B] transition"
                  />
                </div>
              </div>

              {/* Rating Section */}
              <div>
                <label className="block text-gray-700 font-semibold mb-4">
                  How happy are you with our service?
                </label>
                <div className="flex gap-4 justify-start items-center">
                  {[
                    { value: 1, icon: FaFrown, label: "Poor", color: "text-red-500" },
                    { value: 2, icon: FaMeh, label: "Okay", color: "text-yellow-500" },
                    { value: 5, icon: FaSmile, label: "Great", color: "text-green-500" },
                  ].map(({ value, icon: Icon, label, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: value })}
                      className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition ${
                        formData.rating === value
                          ? "border-[#D9526B] bg-[#fdf1f0]"
                          : "border-gray-300 hover:border-[#D9526B]"
                      }`}
                    >
                      <Icon className={`text-3xl ${color}`} />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Your Feedback
                </label>
                <textarea
                  name="message"
                  placeholder="Tell us what you think... Any suggestions or compliments are welcome!"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D9526B] transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white font-semibold rounded-full px-6 py-3 hover:opacity-90 transition disabled:opacity-50 shadow-lg"
              >
                {isSubmitting ? "Sending..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}