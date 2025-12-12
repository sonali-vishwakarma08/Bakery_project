import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { cart: {} };
    setCartItems(Object.values(data.cart || {}));
  }, []);

  const handleQuantityChange = (itemId, delta) => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { cart: {} };
    const updatedItems = [...cartItems];

    const itemIndex = updatedItems.findIndex(item => item.id === itemId || item._id === itemId);
    if (itemIndex !== -1) {
      updatedItems[itemIndex].quantity = Math.max(1, updatedItems[itemIndex].quantity + delta);
      data.cart[itemId] = updatedItems[itemIndex];

      localStorage.setItem("the-velvet-delights", JSON.stringify(data));
      setCartItems(updatedItems);
    }
  };

  const handleRemove = (itemId) => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { cart: {} };
    const updatedItems = [...cartItems];

    const itemIndex = updatedItems.findIndex(item => item.id === itemId || item._id === itemId);
    if (itemIndex !== -1) {
      delete data.cart[itemId];
      updatedItems.splice(itemIndex, 1);

      localStorage.setItem("the-velvet-delights", JSON.stringify(data));
      setCartItems(updatedItems);
      toast.success("Item removed from cart");
    }
  };

  const handleClearCart = () => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {};
    data.cart = {};
    localStorage.setItem("the-velvet-delights", JSON.stringify(data));
    setCartItems([]);
    toast.success("Cart cleared successfully");
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g,"")) : parseFloat(item.price) || 0;
      return acc + priceNum * item.quantity;
    }, 0);
  };

  const total = calculateTotal();

  if (cartItems.length === 0) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf1f0] pt-28 px-6 sm:px-12">
          <h2 className="text-2xl font-bold text-[#D9526B] mb-4">Your cart is empty!</h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#D9526B] text-white py-2 px-6 rounded-full font-medium hover:opacity-90 transition"
          >
            Browse Products
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen pt-28 pb-12 px-6 sm:px-12">
        <h2 className="text-3xl font-bold text-[#D9526B] mb-8 text-center">Your Cart</h2>

        <div className="max-w-7xl mx-auto space-y-6">
          {cartItems.map((item) => {
            const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g,"")) : parseFloat(item.price) || 0;
            const itemTotal = priceNum * item.quantity;
            
            return (
              <div
                key={item.id || item._id}
                className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-lg p-6 gap-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden">
                  <img
                    src={item.images?.[0] ? `http://localhost:5000/uploads/products/${item.images[0]}` : item.image || "https://via.placeholder.com/300x300?text=No+Image"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                </div>
                
                <div className="flex-1 flex flex-col sm:flex-row justify-between w-full gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description || item.desc || "Delicious bakery item"}</p>
                    <p className="text-lg font-bold text-[#D9526B] mt-2">${priceNum.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange(item.id || item._id, -1)}
                        className="bg-[#F2BBB6] w-10 h-10 flex items-center justify-center rounded-l-full font-bold text-[#D9526B] hover:bg-[#e0a9a2] transition"
                      >
                        −
                      </button>
                      <span className="w-12 h-10 flex items-center justify-center bg-white border-t border-b text-gray-800 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id || item._id, 1)}
                        className="bg-[#D9526B] w-10 h-10 flex items-center justify-center rounded-r-full text-white font-bold hover:bg-[#c24257] transition"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-lg font-bold text-gray-900 min-w-[80px] text-center">
                      ${itemTotal.toFixed(2)}
                    </div>
                    
                    <button
                      onClick={() => handleRemove(item.id || item._id)}
                      className="text-red-500 font-semibold hover:text-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="max-w-7xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-xl font-bold text-gray-900">
                Subtotal: <span className="text-[#D9526B] text-2xl">${total.toFixed(2)}</span>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleClearCart}
                  className="bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate("/address-details")}
                  className="bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition shadow-lg"
                >
                  🛒 Proceed to Checkout
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