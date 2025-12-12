import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userAPI, orderAPI } from "../services/api";
import { createPaymentOrder } from "../services/paymentApi";

export default function AddressDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // eslint-disable-line no-unused-vars
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    phone: ""
  });
  const [errors, setErrors] = useState({});

  // Fetch user profile and addresses
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getProfile();
        
        // Correctly access user data from response.data.user
        if (response.data && response.data.user) {
          setUser(response.data.user);
          
          // Load saved addresses
          const savedAddresses = Array.isArray(response.data.user.savedAddresses) ? response.data.user.savedAddresses : [];
          
          // Load primary address if it exists
          let primaryAddress = [];
          if (response.data.user.address && Object.values(response.data.user.address).some(Boolean)) {
            primaryAddress = [{
              id: 'primary',
              name: 'Primary Address',
              ...response.data.user.address
            }];
          }
          
          const allAddresses = [...primaryAddress, ...savedAddresses];
          setAddresses(allAddresses);
          
          // Set default selected address to primary or first saved address
          if (allAddresses.length > 0) {
            setSelectedAddress(allAddresses[0]);
          }
        } else {
          toast.error("Failed to load user profile data");
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast.error("Failed to load address information");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    
    if (!formData.zip.trim()) {
      newErrors.zip = "ZIP code is required";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveNewAddress = () => {
    if (validateForm()) {
      // For now, we'll just use this address for the order
      // In a real app, you might want to save it to the user's profile
      setSelectedAddress({
        ...formData,
        id: 'new'
      });
      setShowNewAddressForm(false);
      toast.success("Address selected successfully");
    }
  };

  const handleContinueToPayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select or enter an address");
      return;
    }
    
    try {
      setLoading(true);
      
      // Get cart items from localStorage
      const cartData = JSON.parse(localStorage.getItem("the-velvet-delights")) || { cart: {} };
      const cartItems = Object.values(cartData.cart || {});
      
      if (cartItems.length === 0) {
        toast.error("Your cart is empty");
        navigate("/products");
        return;
      }
      
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity || 1,
          price: typeof item.price === 'string' ? 
            parseFloat(item.price.replace(/[^0-9.-]+/g,"")) : 
            parseFloat(item.price) || 0
        })),
        delivery_address: selectedAddress
      };
      
      console.log("Creating order with data:", orderData);
      const orderResponse = await orderAPI.create(orderData);
      console.log("Order creation response:", orderResponse);
      
      if (orderResponse.data && orderResponse.data.order) {
        console.log("Order created successfully:", orderResponse.data.order._id);
        // Use the order_code field instead of _id for PayPal
        const orderCode = orderResponse.data.order.order_code;
        console.log("Using order code for PayPal:", orderCode);
        
        // Save order details to localStorage
        localStorage.setItem("currentOrderCode", orderCode);
        localStorage.setItem("currentOrderDetails", JSON.stringify({
          items: orderResponse.data.order.items,
          total: orderResponse.data.order.final_amount
        }));
        localStorage.setItem("selectedDeliveryAddress", JSON.stringify(selectedAddress));
        
        // Create PayPal payment order
        console.log("Creating PayPal payment order with order code:", orderCode);
        try {
          const paymentResponse = await createPaymentOrder(orderCode);
          console.log("Payment response received:", paymentResponse);
          
          if (paymentResponse && paymentResponse.paypal_order) {
            console.log("PayPal order found:", paymentResponse.paypal_order);
            const paypalOrderId = paymentResponse.paypal_order.id;
            const approvalUrl = paymentResponse.paypal_order.links.find(
              (link) => link.rel === "approve"
            )?.href;
            
            console.log("Approval URL:", approvalUrl);
            
            if (approvalUrl) {
              // Store PayPal order ID for verification later
              localStorage.setItem("currentPayPalOrderID", paypalOrderId);
              
              // Redirect to PayPal
              console.log("Redirecting to PayPal...");
              window.location.href = approvalUrl;
              return;
            } else {
              console.error("No approval URL found in PayPal response");
              toast.error("Invalid PayPal response - missing approval URL");
            }
          } else {
            console.error("Invalid payment response:", paymentResponse);
            toast.error("Failed to create payment order - invalid response");
          }
        } catch (paymentError) {
          console.error("Error during payment creation:", paymentError);
          console.error("Payment error response:", paymentError.response?.data);
          toast.error("Payment creation failed: " + (paymentError.response?.data?.message || paymentError.message));
        }
      } else if (orderResponse.data) {
        // Handle case where response is the order object directly
        console.log("Order created successfully:", orderResponse.data._id);
        // Use the order_code field instead of _id for PayPal
        const orderCode = orderResponse.data.order_code;
        console.log("Using order code for PayPal:", orderCode);
        
        // Save order details to localStorage
        localStorage.setItem("currentOrderCode", orderCode);
        localStorage.setItem("currentOrderDetails", JSON.stringify({
          items: orderResponse.data.items,
          total: orderResponse.data.final_amount
        }));
        localStorage.setItem("selectedDeliveryAddress", JSON.stringify(selectedAddress));
        
        // Create PayPal payment order
        console.log("Creating PayPal payment order with order code:", orderCode);
        try {
          const paymentResponse = await createPaymentOrder(orderCode);
          console.log("Payment response received:", paymentResponse);
          
          if (paymentResponse && paymentResponse.paypal_order) {
            console.log("PayPal order found:", paymentResponse.paypal_order);
            const paypalOrderId = paymentResponse.paypal_order.id;
            const approvalUrl = paymentResponse.paypal_order.links.find(
              (link) => link.rel === "approve"
            )?.href;
            
            console.log("Approval URL:", approvalUrl);
            
            if (approvalUrl) {
              // Store PayPal order ID for verification later
              localStorage.setItem("currentPayPalOrderID", paypalOrderId);
              
              // Redirect to PayPal
              console.log("Redirecting to PayPal...");
              window.location.href = approvalUrl;
              return;
            } else {
              console.error("No approval URL found in PayPal response");
              toast.error("Invalid PayPal response - missing approval URL");
            }
          } else {
            console.error("Invalid payment response:", paymentResponse);
            toast.error("Failed to create payment order - invalid response");
          }
        } catch (paymentError) {
          console.error("Error during payment creation:", paymentError);
          console.error("Payment error response:", paymentError.response?.data);
          toast.error("Payment creation failed: " + (paymentError.response?.data?.message || paymentError.message));
        }
      } else {
        console.error("Order creation failed - invalid response:", orderResponse);
        toast.error("Failed to create order - invalid response");
      }
    } catch (error) {
      console.error("Error creating order or payment:", error);
      console.error("Error response:", error.response);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      // Check if it's a forbidden error (authorization)
      if (error.response?.status === 403) {
        toast.error("Access denied. Please make sure you're logged in as a customer.");
        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
        }
        return;
      }
      
      // Check if it's a product not found error
      if (error.response?.status === 404) {
        toast.error("Product not found. Please refresh your cart and try again.");
        return;
      }
      
      // Only show error toast for actual failures
      const errorMessage = error.response?.data?.message || error.message || "Failed to process payment";
      toast.error("Failed to process payment: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Delivery Address</h1>
              <button
                onClick={() => navigate("/cart")}
                className="text-pink-600 hover:text-pink-800 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Cart
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Address Selection */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Select Delivery Address</h2>
                
                {addresses.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {addresses.map((address) => (
                      <div 
                        key={address.id}
                        className={`border rounded-xl p-5 cursor-pointer transition-all ${
                          selectedAddress && selectedAddress.id === address.id
                            ? "border-pink-500 bg-pink-50 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <div className="flex items-start">
                          <div className="flex items-center h-5 mt-0.5">
                            <input
                              type="radio"
                              className="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                              checked={selectedAddress && selectedAddress.id === address.id}
                              onChange={() => setSelectedAddress(address)}
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-gray-900">{address.name}</h3>
                              {address.id === 'primary' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                  Primary
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-gray-600">{address.street}</p>
                            <p className="text-gray-600">{address.city}, {address.state} {address.zip}</p>
                            <p className="text-gray-600">{address.country}</p>
                            <p className="mt-1 text-gray-600">📞 {address.phone}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center mb-8">
                    <p className="text-gray-500">No saved addresses found</p>
                  </div>
                )}

                <button
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="flex items-center text-pink-600 hover:text-pink-800 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {showNewAddressForm ? "Cancel" : "Add New Address"}
                </button>

                {showNewAddressForm && (
                  <div className="mt-6 p-6 border border-gray-200 rounded-xl bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter full name"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="10-digit phone number"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg ${
                            errors.street ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Street address"
                        />
                        {errors.street && (
                          <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg ${
                            errors.city ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="City"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg ${
                            errors.state ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="State"
                        />
                        {errors.state && (
                          <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg ${
                            errors.zip ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="ZIP code"
                        />
                        {errors.zip && (
                          <p className="text-red-500 text-xs mt-1">{errors.zip}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg ${
                            errors.country ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Country"
                        />
                        {errors.country && (
                          <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleSaveNewAddress}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-medium"
                      >
                        Use This Address
                      </button>
                      <button
                        onClick={() => setShowNewAddressForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 sticky top-32">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    {/* Selected Address Preview */}
                    {selectedAddress ? (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-2">Delivery to:</h3>
                        <p className="text-sm text-gray-600">{selectedAddress.name}</p>
                        <p className="text-sm text-gray-600">{selectedAddress.street}</p>
                        <p className="text-sm text-gray-600">{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}</p>
                        <p className="text-sm text-gray-600">{selectedAddress.country}</p>
                        <p className="text-sm text-gray-600 mt-1">📞 {selectedAddress.phone}</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                        <p className="text-gray-500 text-sm">No address selected</p>
                      </div>
                    )}
                    
                    {/* Action Button */}
                    <button
                      onClick={handleContinueToPayment}
                      disabled={!selectedAddress}
                      className={`w-full py-3 rounded-lg font-medium transition-all shadow-sm ${
                        selectedAddress
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}