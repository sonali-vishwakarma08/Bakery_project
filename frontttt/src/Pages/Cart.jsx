import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { cart: {} };
    setCartItems(Object.values(data.cart || {}));
    setLoading(false);
  }, []);

  const handleQuantityChange = (itemId, delta) => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { cart: {} };
    const updatedItems = [...cartItems];

    const itemIndex = updatedItems.findIndex(item => item.id === itemId || item._id === itemId);
    if (itemIndex !== -1) {
      const newQuantity = Math.max(1, updatedItems[itemIndex].quantity + delta);
      updatedItems[itemIndex].quantity = newQuantity;
      data.cart[itemId] = updatedItems[itemIndex];

      localStorage.setItem("the-velvet-delights", JSON.stringify(data));
      setCartItems(updatedItems);
      toast.success(delta > 0 ? "Quantity increased" : "Quantity decreased");
    }
  };

  const handleRemove = (itemId) => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { cart: {} };
    const updatedItems = [...cartItems];

    const itemIndex = updatedItems.findIndex(item => item.id === itemId || item._id === itemId);
    if (itemIndex !== -1) {
      const itemName = updatedItems[itemIndex].name;
      delete data.cart[itemId];
      updatedItems.splice(itemIndex, 1);

      localStorage.setItem("the-velvet-delights", JSON.stringify(data));
      setCartItems(updatedItems);
      toast.success(`${itemName} removed from cart`);
    }
  };

  const handleClearCart = () => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {};
    data.cart = {};
    localStorage.setItem("the-velvet-delights", JSON.stringify(data));
    setCartItems([]);
    toast.success("Cart cleared successfully");
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g,"")) : parseFloat(item.price) || 0;
      return acc + priceNum * item.quantity;
    }, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateShipping = (subtotal) => {
    return subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-[#fdf1f0] pt-28 px-6 sm:px-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9526B]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf1f0] pt-28 px-6 sm:px-12">
          <div className="text-center max-w-md">
            <div className="mx-auto bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#D9526B] mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-3 px-8 rounded-full font-medium hover:opacity-90 transition shadow-lg"
            >
              Browse Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in Cart
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => {
                    const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g,"")) : parseFloat(item.price) || 0;
                    const itemTotal = priceNum * item.quantity;
                    
                    return (
                      <div key={item.id || item._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={item.images?.[0] ? `http://localhost:5000/uploads/products/${item.images[0]}` : item.image || "https://via.placeholder.com/300x300?text=No+Image"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                              }}
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description || item.desc || "Delicious bakery item"}</p>
                                <p className="text-lg font-bold text-[#D9526B] mt-2">${priceNum.toFixed(2)}</p>
                              </div>
                              
                              {/* Actions */}
                              <div className="flex flex-col sm:items-end gap-3">
                                {/* Quantity Controls */}
                                <div className="flex items-center">
                                  <button
                                    onClick={() => handleQuantityChange(item.id || item._id, -1)}
                                    className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-l-md text-gray-600 hover:bg-gray-200 transition"
                                    aria-label="Decrease quantity"
                                  >
                                    −
                                  </button>
                                  <span className="w-12 h-8 flex items-center justify-center bg-white border-y border-gray-200 text-gray-800 font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(item.id || item._id, 1)}
                                    className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-r-md text-gray-600 hover:bg-gray-200 transition"
                                    aria-label="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>
                                
                                {/* Item Total & Remove */}
                                <div className="flex items-center gap-4">
                                  <span className="text-lg font-semibold text-gray-900">${itemTotal.toFixed(2)}</span>
                                  <button
                                    onClick={() => handleRemove(item.id || item._id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                    aria-label="Remove item"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/products")}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </button>
                
                <button
                  onClick={handleClearCart}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-[#D9526B]">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {shipping > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => navigate("/address-details")}
                  className="mt-6 w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-4 rounded-full font-bold text-lg hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Proceed to Checkout
                </button>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  or
                </div>
                
                <button
                  onClick={() => navigate("/products")}
                  className="mt-2 w-full text-[#D9526B] py-3 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;