import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAuth } from "firebase/auth";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const validationSchema = Yup.object({
  name: Yup.string().required("Full name is required"),
  city: Yup.string().required("City is required"),
  address: Yup.string().required("Address is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Only digits allowed")
    .min(10, "Phone must be at least 10 digits")
    .max(10, "Phone must not exceed 10 digits")
    .required("Phone is required"),
});

export default function Orders() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userOrders, setUserOrders] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    const buyNowData = location.state?.items || [];

    if (buyNowData.length > 0) {
      setCartItems(buyNowData);
      setLoading(false);
    } else {
      const fetchOrders = async () => {
        try {
          const ordersCol = collection(db, "users", user.uid, "orders");
          const ordersSnapshot = await getDocs(ordersCol);
          const orders = ordersSnapshot.docs.map((doc) => doc.data());
          setUserOrders(orders);
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch orders!");
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [auth, location.state, navigate]);

  const formik = useFormik({
    initialValues: {
      name: "",
      city: "",
      address: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login to place order!");
        navigate("/login");
        return;
      }

      if (cartItems.length === 0) {
        toast.error("Cart is empty!");
        return;
      }

      const orderId = Date.now().toString();
      const total = cartItems.reduce((acc, item) => {
        const priceNum = parseFloat(item.price.replace("$", "")) || 0;
        return acc + priceNum * item.quantity;
      }, 0);

      const orderData = {
        id: orderId,
        items: cartItems,
        total: total.toFixed(2),
        status: "Pending",
        orderDate: new Date().toISOString(),
        customer: values,
      };

      try {
        await setDoc(doc(db, "users", user.uid, "orders", orderId), orderData);

        toast.success("Order placed successfully!");
        navigate(`/orderdetails/${orderId}`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to place order!");
      }
    },
  });

  if (loading) return <div className="pt-28 text-center">Loading...</div>;

  if (cartItems.length > 0) {
    return (
      <>
        <Header />
        <div className="bg-[#fdf1f0] min-h-screen py-24 px-4 flex justify-center">
          <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-xl">
            <h2 className="text-4xl font-bold text-center text-[#D9526B] mb-8">
              Shipping Details
            </h2>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-[#D9526B] outline-none"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}

              <input
                type="text"
                name="city"
                placeholder="City"
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-[#D9526B] outline-none"
                {...formik.getFieldProps("city")}
              />
              {formik.touched.city && formik.errors.city && (
                <p className="text-red-500 text-sm">{formik.errors.city}</p>
              )}

              <textarea
                name="address"
                rows="3"
                placeholder="Full Address"
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-[#D9526B] outline-none"
                {...formik.getFieldProps("address")}
              ></textarea>
              {formik.touched.address && formik.errors.address && (
                <p className="text-red-500 text-sm">{formik.errors.address}</p>
              )}

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-[#D9526B] outline-none"
                {...formik.getFieldProps("phone")}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-sm">{formik.errors.phone}</p>
              )}

              <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="w-full border-2 border-[#D9526B] text-[#D9526B] py-3 rounded-full font-semibold hover:bg-[#fdf1f0] hover:scale-105 transition cursor-pointer"
                >
                  Back to Cart
                </button>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#F2BBB6] to-[#D9526B] text-white py-3 rounded-full font-semibold shadow-md hover:scale-105 transition cursor-pointer"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen py-24 px-4">
        <h2 className="text-3xl font-bold text-[#D9526B] mb-6 text-center">
          Your Orders
        </h2>

        {userOrders.length === 0 ? (
          <p className="text-center text-gray-700">No orders found.</p>
        ) : (
          <div className="max-w-5xl mx-auto space-y-4">
            {userOrders
              .sort((a, b) => b.orderDate.localeCompare(a.orderDate))
              .map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="mt-2">
                      <p className="font-semibold text-gray-700">Products:</p>
                      <ul className="list-disc list-inside text-gray-600">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.name} x {item.quantity} (${item.price})
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="font-semibold text-gray-700">
                      Order ID: {order.id}
                    </p>
                    <p className="text-gray-600">
                      Total: ${order.total} | Status: {order.status}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Date: {new Date(order.orderDate).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/orderdetails/${order.id}`)}
                    className="bg-[#D9526B] text-white px-4 py-2 rounded-full hover:opacity-90 mt-4 md:mt-0"
                  >
                    View Details
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
