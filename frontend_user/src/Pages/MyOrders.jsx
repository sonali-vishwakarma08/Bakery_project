import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {};
    setOrders(Object.values(data.orders || {}));
  }, []);

  if (orders.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf1f0] pt-28 px-4 sm:px-6 md:px-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#D9526B] mb-4">
            You have no orders yet!
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#D9526B] text-white py-2 px-6 rounded-full font-medium hover:opacity-90 transition"
          >
            Browse Products
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen pt-28 px-4 sm:px-6 md:px-12">
        <h2 className="text-3xl font-bold text-[#D9526B] mb-8 text-center">
          My Orders
        </h2>

        <div className="space-y-6 max-w-4xl mx-auto">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg text-[#D9526B] mb-4">
                Order #{order.id}
              </h3>
              <p className="text-gray-700 mb-4">
                Date: {new Date(order.date).toLocaleString()}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-center bg-[#FAF9EE] rounded-2xl p-4 shadow"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-xl mb-2"
                    />
                    <h4 className="font-semibold text-[#D9526B]">{item.name}</h4>
                    <p className="text-gray-700">{item.desc}</p>
                    <p className="font-bold text-gray-900 mt-1">{item.price}</p>
                    <p className="text-gray-600 mt-1">Qty: {item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="text-gray-800 font-semibold">Total: ${order.total}</p>
                <button
                  onClick={() => navigate(`/orderdetails/${order.id}`)}
                  className="bg-gradient-to-r from-[#F2BBB6] to-[#D9526B] text-white py-2 px-6 rounded-full font-semibold hover:opacity-90 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
