import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Feedback() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    message: Yup.string().required("Message is required"),
  });

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

          <Formik
            initialValues={{ name: "", email: "", message: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              const data =
                JSON.parse(localStorage.getItem("the-velvet-delights")) || {
                  wishlist: {},
                  cart: {},
                  feedback: [],
                };

              if (!data.feedback) data.feedback = []; 

              const newFeedback = {
                id: Date.now(),
                name: values.name,
                email: values.email,
                message: values.message,
              };

              data.feedback.push(newFeedback);

              localStorage.setItem(
                "the-velvet-delights",
                JSON.stringify(data)
              );

              toast.success("Thank you for your feedback!", {
                position: "top-center",
              });

              resetForm();
              setTimeout(() => navigate("/"), 1500);
            }}
          >
            {({ values, handleChange }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D9526B] transition"
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D9526B] transition"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={values.message}
                    rows="5"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D9526B] transition resize-none"
                  />
                  <ErrorMessage
                    name="message"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white font-medium rounded-full px-6 py-3 hover:opacity-90 transition"
                >
                  Submit Feedback
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Footer />
    </>
  );
}
