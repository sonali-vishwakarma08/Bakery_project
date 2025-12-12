import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/apiConfig";

const AddressSelection = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    phone: ""
  });

  // Load saved addresses and cart items from localStorage and API
  useEffect(() => {
    const loadData = async () => {
      setApiLoading(true);
      
      // Load cart items
      const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {};
      const cartData = Object.values(data.cart || {});
      setCartItems(cartData);
      
      // Load addresses from API
      await loadAddressesFromAPI();
      
      setApiLoading(false);
    };
    
    loadData();
  }, []);

  const loadAddressesFromAPI = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If not logged in, use localStorage addresses
        const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {};
        const savedAddresses = data.addresses || [];
        setAddresses(savedAddresses);
        
        // If there are saved addresses, select the first one by default
        if (savedAddresses.length > 0) {
          setSelectedAddress(savedAddresses[0]);
        }
        return;
      }
      
      // Fetch addresses from API
      const response = await fetch(API_ENDPOINTS.USER.PROFILE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }
      
      if (data && data.user) {
        // Process addresses - handle both array and object formats
        let savedAddresses = [];
        if (Array.isArray(data.user.savedAddresses)) {
          savedAddresses = data.user.savedAddresses.map((addr, index) => ({
            ...addr,
            id: addr._id || addr.id || index
          }));
        } else if (data.user.savedAddresses && typeof data.user.savedAddresses === 'object') {
          // Handle case where savedAddresses is an object instead of array
          savedAddresses = Object.values(data.user.savedAddresses).map((addr, index) => ({
            ...addr,
            id: addr._id || addr.id || index
          }));
        }
        
        // Add primary address if it exists
        let primaryAddress = [];
        if (data.user.address && typeof data.user.address === 'object' && Object.values(data.user.address).some(Boolean)) {
          primaryAddress = [{
            id: 'primary',
            name: data.user.address.name || 'Primary Address',
            ...data.user.address
          }];
        }
        
        const allAddresses = [...primaryAddress, ...savedAddresses];
        setAddresses(allAddresses);
        
        // If there are saved addresses, select the first one by default
        if (allAddresses.length > 0) {
          setSelectedAddress(allAddresses[0]);
        }
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
      toast.error("Failed to load addresses. Please try again.");
      
      // Fallback to localStorage
      const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {};
      const savedAddresses = data.addresses || [];
      setAddresses(savedAddresses);
      
      // If there are saved addresses, select the first one by default
      if (savedAddresses.length > 0) {
        setSelectedAddress(savedAddresses[0]);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form
    if (!formData.fullName || !formData.street || !formData.city || 
        !formData.state || !formData.zip || !formData.phone) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Save to API if user is logged in
        const addressData = {
          name: formData.fullName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
          phone: formData.phone
        };
        
        // For now, we'll save to localStorage as well for consistency
        // In a full implementation, you would call an API endpoint to save the address
        const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {};
        const newAddress = {
          id: Date.now(),
          ...addressData,
          isDefault: addresses.length === 0 // First address becomes default
        };
        
        const updatedAddresses = [...addresses, newAddress];
        data.addresses = updatedAddresses;
        localStorage.setItem("the-velvet-delights", JSON.stringify(data));
        
        // Update state
        setAddresses(updatedAddresses);
        setSelectedAddress(newAddress);
        setShowAddForm(false);
        setFormData({
          fullName: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "India",
          phone: ""
        });
        
        toast.success("Address saved successfully!");
      } else {
        // Save to localStorage only if not logged in
        const newAddress = {
          id: Date.now(),
          ...formData,
          isDefault: addresses.length === 0 // First address becomes default
        };
        
        // Save to localStorage
        const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {};
        const updatedAddresses = [...addresses, newAddress];
        data.addresses = updatedAddresses;
        localStorage.setItem("the-velvet-delights", JSON.stringify(data));
        
        // Update state
        setAddresses(updatedAddresses);
        setSelectedAddress(newAddress);
        setShowAddForm(false);
        setFormData({
          fullName: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "India",
          phone: ""
        });
        
        toast.success("Address saved successfully!");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address. Please try again.");
    }
    
    setLoading(false);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      toast.error("Please select or add an address");
      return;
    }
    
    // Save selected address to localStorage for payment page
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {};
    data.selectedAddress = selectedAddress;
    localStorage.setItem("the-velvet-delights", JSON.stringify(data));
    
    // Navigate to payment
    navigate("/payment");
  };

  const handleEditAddress = (address) => {
    setFormData({
      fullName: address.fullName || address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country || "India",
      phone: address.phone
    });
    setShowAddForm(true);
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace("$", "")) : parseFloat(item.price) || 0;
    return acc + priceNum * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  if (apiLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-rose-50">
        <Header />
        <div className="flex-grow flex items-center justify-center px-4 py-12" style={{ marginTop: '4rem' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading addresses...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-rose-50">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8" style={{ marginTop: '4rem' }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Delivery Address</h1>
            <p className="text-gray-600 mt-2">Select or add a delivery address for your order</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Address Selection Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Address
                  </button>
                </div>
                
                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved addresses</h3>
                    <p className="text-gray-600 mb-6">Add a new address to get started with your order</p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-2 px-6 rounded-lg transition-all"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div 
                        key={address.id}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                          selectedAddress && selectedAddress.id === address.id 
                            ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-100' 
                            : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                        }`}
                        onClick={() => handleSelectAddress(address)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{address.fullName || address.name}</h3>
                            <p className="text-gray-600 mt-1">{address.street}</p>
                            <p className="text-gray-600">{address.city}, {address.state} {address.zip}</p>
                            <p className="text-gray-600">{address.country}</p>
                            <p className="text-gray-600 mt-1">Phone: {address.phone}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {selectedAddress && selectedAddress.id === address.id && (
                              <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Selected
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAddress(address);
                              }}
                              className="text-pink-600 hover:text-pink-800 text-sm flex items-center gap-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Summary & Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-pink-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleProceedToPayment}
                  disabled={!selectedAddress || loading}
                  className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Proceed to Payment
                    </>
                  )}
                </button>
                
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate("/cart")}
                    className="text-pink-600 hover:text-pink-800 font-medium text-sm flex items-center justify-center gap-1 mx-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add/Edit Address Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {addresses.length > 0 ? "Edit Address" : "Add New Address"}
                    </h3>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          id="street"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          placeholder="Enter street address"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="City"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="State"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            id="zip"
                            name="zip"
                            value={formData.zip}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="ZIP Code"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="Phone number"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg shadow transition-all disabled:opacity-70"
                      >
                        {loading ? "Saving..." : "Save Address"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AddressSelection;