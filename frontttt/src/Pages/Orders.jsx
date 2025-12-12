import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";
import { orderAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { getImageUrl } from "../config/apiConfig";

export default function Orders() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "baking":
        return "bg-indigo-100 text-indigo-800";
      case "packed":
        return "bg-purple-100 text-purple-800";
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "🕒";
      case "confirmed":
        return "✅";
      case "baking":
        return "🔥";
      case "packed":
        return "📦";
      case "out_for_delivery":
        return "🚚";
      case "delivered":
        return "🎉";
      case "cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  const formatCurrency = (amount) => {
    const validAmount = isNaN(parseFloat(amount)) ? 0 : parseFloat(amount);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(validAmount);
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const res = await orderAPI.getMyOrders();
        setOrders(res.data || res);
      } catch (error) {
        console.warn("Failed to load orders", error);
        toast.error("Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pt-24 pb-16 px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600 mt-1">Track your order history and status</p>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-sm font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Profile
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 p-10 text-center">
                <div className="text-6xl mb-5">🧁</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h3>
                <p className="text-gray-600 mb-7 max-w-md mx-auto">Start ordering your bakery favorites and they'll appear here!</p>
                <button
                  onClick={() => navigate("/products")}
                  className="px-7 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {(() => {
                    const indexOfLastOrder = currentPage * ordersPerPage;
                    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
                    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
                    
                    return (
                      <>
                        {currentOrders.map((order) => {
                          const totalItems = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                          
                          return (
                            <article key={order._id} className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all bg-white border-gray-100">
                              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 pb-5 border-b border-gray-100">
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                      <h4 className="text-xl font-bold text-gray-900">Order #{order.order_code || order._id?.slice(-8)}</h4>
                                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)} {order.status?.replace('_', ' ') || 'Unknown'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <span>
                                      <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </span>
                                    <span>
                                      <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                      </svg>
                                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                    </span>
                                    <span>
                                      <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      {order.delivery_address?.city || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.final_amount || order.total_amount || 0)}</p>
                                  </div>
                                  
                                  <button
                                    className="px-5 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-medium shadow-sm whitespace-nowrap"
                                    onClick={() => navigate(`/order/${order._id}`)}
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                              
                              <div className="mt-5">
                                <h5 className="text-sm font-semibold text-gray-700 mb-3">Items in this order:</h5>
                                <div className="flex flex-wrap -space-x-2">
                                  {order.items?.slice(0, 6).map((it, idx) => {
                                    const img = it.product?.images?.[0]
                                      ? getImageUrl(`products/${it.product.images[0]}`)
                                      : null;
                                    return img ? (
                                      <img 
                                        key={idx} 
                                        src={img} 
                                        alt={it.product?.name} 
                                        className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm" 
                                        title={`${it.product?.name} × ${it.quantity}`}
                                        onError={(e) => {
                                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='8' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                                        }}
                                      />
                                    ) : (
                                      <div 
                                        key={idx} 
                                        className="w-16 h-16 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center shadow-sm"
                                        title={`${it.product?.name} × ${it.quantity}`}
                                      >
                                        <Package className="text-gray-400" size={22} />
                                      </div>
                                    );
                                  })}
                                  {order.items?.length > 6 && (
                                    <div className="w-16 h-16 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center shadow-sm">
                                      <span className="text-xs font-medium text-gray-600">+{order.items.length - 6}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>
                
                {(() => {
                  const totalPages = Math.ceil(orders.length / ordersPerPage);
                  return totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 pt-6 border-t border-gray-100">
                      <p className="text-gray-600 text-sm">
                        Showing {Math.min((currentPage - 1) * ordersPerPage + 1, orders.length)} to {Math.min(currentPage * ordersPerPage, orders.length)} of {orders.length} orders
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === 1 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm'
                          }`}
                        >
                          Previous
                        </button>
                        
                        <div className="flex items-center">
                          {[...Array(Math.min(5, totalPages))].map((_, index) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = index + 1;
                            } else if (currentPage <= 3) {
                              pageNum = index + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + index;
                            } else {
                              pageNum = currentPage - 2 + index;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-4 py-2 rounded-lg mx-0.5 ${
                                  currentPage === pageNum
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === totalPages 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}