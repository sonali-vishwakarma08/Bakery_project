import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";
import { getMyPayments } from "../services/paymentApi";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function Payments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "created":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      case "partially_refunded":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "failed":
        return <XCircle className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "created":
        return <CreditCard className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case "card":
        return <CreditCard className="w-5 h-5" />;
      case "paypal":
        return <Wallet className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getPaymentMethodDisplay = (payment) => {
    // For PayPal gateway, always display "PayPal" regardless of payment_method field
    if (payment.gateway === 'paypal') {
      return 'PayPal';
    }
    
    // For other gateways, use the payment_method field
    return payment.payment_method?.toUpperCase() || 'N/A';
  };

  const formatCurrency = (amount, currency = "INR") => {
    const validAmount = isNaN(parseFloat(amount)) ? 0 : parseFloat(amount);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(validAmount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const res = await getMyPayments({ page: currentPage, limit: paymentsPerPage });
        setPayments(res.payments || []);
      } catch (error) {
        console.warn("Failed to load payments", error);
        toast.error("Failed to load payments");
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [currentPage]);

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
                <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                <p className="text-gray-600 mt-1">View your payment transactions and status</p>
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

            {payments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 p-10 text-center">
                <div className="text-6xl mb-5">💳</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Payments Yet</h3>
                <p className="text-gray-600 mb-7 max-w-md mx-auto">Your payment history will appear here after you make purchases.</p>
                <button
                  onClick={() => navigate("/products")}
                  className="px-7 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {payments.map((payment) => (
                    <article key={payment._id} className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all bg-white border-gray-100">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 pb-5 border-b border-gray-100">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <h4 className="text-xl font-bold text-gray-900">Payment #{payment._id?.slice(-8)}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(payment.payment_status)}`}>
                                {getStatusIcon(payment.payment_status)} {payment.payment_status?.replace('_', ' ') || 'Unknown'}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>
                              <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(payment.createdAt)}
                            </span>
                            <span>
                              <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Order: {payment.order?.order_code || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                              {getPaymentMethodIcon(payment.payment_method)}
                              {getPaymentMethodDisplay(payment)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Amount</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(payment.amount, payment.currency)}</p>
                          </div>
                          
                          {payment.gateway_payment_id && (
                            <button
                              onClick={() => navigator.clipboard.writeText(payment.gateway_payment_id).then(() => toast.success("Payment ID copied to clipboard"))}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium shadow-sm text-sm flex items-center gap-2"
                              title="Copy Payment ID"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy ID
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {payment.paid_at && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Paid on {formatDate(payment.paid_at)}
                          </p>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
                
                {(() => {
                  // For simplicity, we'll assume there are more payments if we have a full page
                  const totalPages = payments.length === paymentsPerPage ? currentPage + 1 : currentPage;
                  return totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 pt-6 border-t border-gray-100">
                      <p className="text-gray-600 text-sm">
                        Showing {(currentPage - 1) * paymentsPerPage + 1} to {Math.min(currentPage * paymentsPerPage, payments.length + (currentPage - 1) * paymentsPerPage)} of many payments
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
                          <button
                            className={`px-4 py-2 rounded-lg mx-0.5 ${
                              currentPage === 1
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {currentPage}
                          </button>
                          
                          {totalPages > currentPage && (
                            <button
                              onClick={() => setCurrentPage(prev => prev + 1)}
                              className="px-4 py-2 rounded-lg mx-0.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              {currentPage + 1}
                            </button>
                          )}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          disabled={payments.length < paymentsPerPage}
                          className={`px-4 py-2 rounded-lg ${
                            payments.length < paymentsPerPage
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