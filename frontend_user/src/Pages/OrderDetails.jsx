import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchOrder = async (user) => {
      if (!orderId) {
        toast.error("Order ID is missing!");
        navigate("/orders");
        return;
      }

      try {
        const orderRef = doc(db, "users", user.uid, "orders", orderId);
        const snap = await getDoc(orderRef);

        if (snap.exists()) {
          setOrder(snap.data());
        } else {
          toast.error("Order not found!");
          navigate("/orders");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch order!");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        toast.error("Please login!");
        navigate("/login");
        setLoading(false);
        return;
      }
      fetchOrder(user);
    });

    return () => unsubscribe();
  }, [auth, navigate, orderId]);

  if (loading) return <div className="pt-28 text-center">Loading...</div>;
  if (!order)
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf1f0] pt-28 px-4">
          <h2 className="text-2xl font-bold text-[#D9526B] mb-4">
            Order not found!
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#D9526B] text-white py-2 px-6 rounded-full font-medium hover:opacity-90 transition cursor-pointer"
          >
            Browse Products
          </button>
        </div>
        <Footer />
      </>
    );

  return (
    <div>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen pt-28 pb-12 px-4 sm:px-6 md:px-12">
        <h2 className="text-3xl font-bold text-[#D9526B] mb-6 text-center">
          Order Details
        </h2>

        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Order Date:</strong>{" "}
            {new Date(order.orderDate).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>

          <h3 className="mt-4 text-xl font-semibold text-[#D9526B]">
            Customer Info
          </h3>
          <p>
            <strong>Name:</strong> {order.customer.name}
          </p>
          <p>
            <strong>City:</strong> {order.customer.city}
          </p>
          <p>
            <strong>Address:</strong> {order.customer.address}
          </p>
          <p>
            <strong>Phone:</strong> {order.customer.phone}
          </p>

          <h3 className="mt-6 text-xl font-semibold text-[#D9526B]">
            Products
          </h3>
          <div className="space-y-4 mt-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b pb-2"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: {item.price}</p>

                  <button
                    onClick={() =>
                      navigate("/payment", {
                        state: { orderId: order.id, product: item },
                      })
                    }
                    className="mt-2 bg-gradient-to-r from-[#F2BBB6] to-[#D9526B] text-white py-1 px-3 rounded-full font-semibold hover:scale-105 transition cursor-pointer"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-lg font-semibold">
            Total: <span className="text-[#D9526B]">${order.total}</span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/cart")}
              className="mt-6 bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-2 px-4 rounded-full font-semibold hover:opacity-90 transition cursor-pointer"
            >
              Back to Cart
            </button>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-2 px-4 rounded-full font-semibold hover:opacity-90 transition cursor-pointer"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetails;
