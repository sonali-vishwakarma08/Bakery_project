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
        const token = localStorage.getItem("token");
        
        if (!token) {
          toast.error("Please login to view order details!");
          navigate("/login");
          return;
        }

        const response = await orderAPI.getOrderDetails(id);

        if (response.data && response.data._id) {
          setOrder(response.data);
        } else {
          toast.error("Order not found!");
          navigate("/products");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        if (error.response && error.response.status === 404) {
          toast.error("Order not found!");
        } else if (error.response && error.response.status === 403) {
          toast.error("Access denied. Please login with the correct account.");
        } else {
          toast.error("Failed to fetch order details!");
        }
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  );
  
  if (!order) return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 pt-20">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-full font-medium hover:opacity-90 transition cursor-pointer w-full"
          >
            Browse Products
          </button>
        </div>
      </div>
      <Footer />
    </>
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      baking: 'bg-indigo-100 text-indigo-800',
      packed: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Container */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-purple-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <button
                    onClick={() => navigate("/profile?tab=orders")}
                    className="flex items-center text-pink-600 hover:text-pink-800 mb-2"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Orders
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                  <p className="text-gray-600 mt-1">
                    Order #{order.order_code || order._id?.slice(-8)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium text-lg text-gray-900">
                      {formatCurrency(order.final_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="font-medium text-gray-900">
                      {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0} items
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Order Items */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item._id} className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                        {item.product?.images?.[0] ? (
                          <img
                            src={getImageUrl(`products/${item.product.images[0]}`)}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='8' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.product?.name || 'Product'}</h3>
                            {(item.flavor || item.weight) && (
                              <p className="text-sm text-gray-500 mt-1">
                                {item.flavor && `Flavor: ${item.flavor}`}
                                {item.flavor && item.weight && " • "}
                                {item.weight && `Weight: ${item.weight}`}
                              </p>
                            )}
                          </div>
                          <p className="font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                        </div>
                        
                        {item.custom_message && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Message:</span> {item.custom_message}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Summary */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-5 border border-pink-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatCurrency(order.subtotal_amount)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Charge</span>
                      <span className="font-medium">{formatCurrency(order.delivery_charge)}</span>
                    </div>
                    
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(order.discount_amount)}</span>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t border-gray-200 flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-pink-600">{formatCurrency(order.final_amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Shipping Address</h2>
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-5 border border-pink-100">
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900">{order.delivery_address?.name || 'N/A'}</p>
                        <p className="text-gray-600">{order.delivery_address?.street || 'N/A'}</p>
                        <p className="text-gray-600">
                          {order.delivery_address?.city || 'N/A'}, {order.delivery_address?.state || 'N/A'} - {order.delivery_address?.zip || 'N/A'}
                        </p>
                        <p className="text-gray-600">Phone: {order.delivery_address?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Customer</h2>
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-5 border border-pink-100">
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                        <p className="text-gray-600">{order.user?.email || 'N/A'}</p>
                        <p className="text-gray-600">Phone: {order.user?.phone || order.delivery_address?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => navigate("/products")}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-8 rounded-full font-medium hover:opacity-90 transition shadow-lg"
                >
                  Continue Shopping
                </button>
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