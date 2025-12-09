import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [method, setMethod] = useState("UPI");

  useEffect(() => {
    if (location.state && location.state.product) {
      setItem(location.state.product);
    } else {
      toast.error("No product found to pay for!");
      navigate("/orders");
    }
  }, [location.state, navigate]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg">
        Product not found
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen flex flex-col pt-28 px-4 sm:px-6 md:px-12 pb-12">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#D9526B] mb-6 sm:mb-8">
            Payment
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <img
              src={item.image}
              alt={item.name}
              className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-xl shadow"
            />
            <div className="flex-1 flex flex-col gap-2">
              <h3 className="text-xl sm:text-2xl font-semibold text-[#D9526B]">{item.name}</h3>
              <p className="text-gray-700 text-sm sm:text-base">{item.desc}</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-2">{item.price}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Payment Method</h3>
            <div className="space-y-2 sm:space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="UPI"
                  checked={method === "UPI"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="accent-[#D9526B]"
                />
                UPI
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Credit Card"
                  checked={method === "Credit Card"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="accent-[#D9526B]"
                />
                Credit Card
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Cash on Delivery"
                  checked={method === "Cash on Delivery"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="accent-[#D9526B]"
                />
                Cash on Delivery
              </label>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto bg-gray-300 text-gray-800 py-3 px-6 rounded-full font-semibold hover:opacity-90 transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => toast.success(`Paid successfully via ${method}!`)}
                className="w-full sm:w-auto bg-gradient-to-r from-[#F2BBB6] to-[#D9526B] text-white py-3 px-6 rounded-full font-semibold shadow hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
