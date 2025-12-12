import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";
import { orderAPI } from "../services/api";
import { getImageUrl } from "../config/apiConfig";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        toast.error("Order ID is missing!");
        navigate("/products");
        return;
      }

      try {
        setLoading(true);
        const orderData = await orderAPI.getOrderById(id);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-[#fdf1f0] pt-28 px-6 sm:px-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9526B]"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf1f0] pt-28 px-6 sm:px-12">
          <h2 className="text-2xl font-bold text-[#D9526B] mb-4">Order not found</h2>
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
      <div className="min-h-screen bg-[#fdf1f0] pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                <p className="text-gray-600 mt-1">Order #{order._id}</p>
              </div>
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Items</h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <div key={index} className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={item.product?.images?.[0] ? getImageUrl(`products/${item.product.images[0]}`) : "https://via.placeholder.com/300x300?text=No+Image"}
                            alt={item.product?.name || item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{item.product?.name || item.name}</h3>
                              {item.flavor && (
                                <p className="text-gray-600 text-sm mt-1">Flavor: {item.flavor}</p>
                              )}
                              {item.weight && (
                                <p className="text-gray-600 text-sm">Weight: {item.weight}</p>
                              )}
                              {item.custom_message && (
                                <p className="text-gray-600 text-sm mt-1">Message: {item.custom_message}</p>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-gray-600">Qty: {item.quantity}</p>
                                <p className="text-lg font-bold text-gray-900 mt-1">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Delivery Address</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{order.delivery_address?.name}</span><br />
                      {order.delivery_address?.street}<br />
                      {order.delivery_address?.city}, {order.delivery_address?.state} {order.delivery_address?.zip}<br />
                      {order.delivery_address?.phone}
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${order.subtotal?.toFixed(2) || "0.00"}</span>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {order.shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${order.shipping?.toFixed(2) || "0.00"}`
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${order.tax?.toFixed(2) || "0.00"}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-[#D9526B]">${order.total?.toFixed(2) || "0.00"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Order Date</span>
                      <span className="font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium capitalize">{order.payment_method || "N/A"}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Payment Status</span>
                      <span className={`font-medium ${order.payment_status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                        {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={() => navigate("/products")}
                    className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-3 rounded-full font-medium hover:opacity-90 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetails;