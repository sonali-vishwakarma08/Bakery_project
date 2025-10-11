import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { cart: {} };
    setCartItems(Object.values(data.cart || {}));
  }, []);

  const handleQuantityChange = (index, delta) => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { cart: {} };
    const updatedItems = [...cartItems];

    updatedItems[index].quantity = Math.max(1, updatedItems[index].quantity + delta);
    data.cart[updatedItems[index].id] = updatedItems[index];

    localStorage.setItem("the-velvet-delights", JSON.stringify(data));
    setCartItems(updatedItems);
  };

  const handleRemove = (index) => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { cart: {} };
    const updatedItems = [...cartItems];
    const removedItem = updatedItems[index];

    delete data.cart[removedItem.id];
    updatedItems.splice(index, 1);

    localStorage.setItem("the-velvet-delights", JSON.stringify(data));
    setCartItems(updatedItems);
  };

  const handleClearCart = () => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || {};
    data.cart = {};
    localStorage.setItem("the-velvet-delights", JSON.stringify(data));
    setCartItems([]);
  };

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
  const total = cartItems.reduce((acc, item) => {
    const priceNum = parseFloat(item.price.replace("$", "")) || 0;
    return acc + priceNum * item.quantity;
  }, 0);

  return (
    <div>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen pt-28 pb-12 px-6 sm:px-12">
        <h2 className="text-3xl font-bold text-[#D9526B] mb-8 text-center">Your Cart</h2>

        <div className="max-w-5xl mx-auto space-y-6">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center bg-white rounded-3xl shadow-lg p-6 gap-6"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-48 h-48 object-cover rounded-2xl shadow"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[#D9526B]">{item.name}</h3>
                  <p className="text-gray-700 text-sm mt-1">{item.desc}</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">{item.price}</p>
                </div>

                <div className="flex items-center mt-4 gap-4">
                  <button
                    onClick={() => handleQuantityChange(index, -1)}
                    className="bg-[#F2BBB6] px-4 py-2 rounded-l-full font-bold text-[#D9526B]"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 bg-white border-t border-b text-gray-800 font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(index, 1)}
                    className="bg-[#D9526B] px-4 py-2 rounded-r-full text-white font-bold"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(index)}
                    className="ml-auto text-red-500 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="max-w-5xl mx-auto mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xl font-semibold text-gray-800">
              Total: <span className="text-[#D9526B]">${total.toFixed(2)}</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition"
              >
                Clear Cart
              </button>
              <button
                onClick={() => navigate("/products")}
                className="bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition"
              >
                Browse More Products
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Cart;
