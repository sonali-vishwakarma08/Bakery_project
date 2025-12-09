import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const fetchCart = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      setCartItems(snapshot.data().cart || []);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);
    fetchCart(user);
  }, [auth.currentUser, navigate]);

  const handleQuantityChange = async (index, delta) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = Math.max(1, updatedItems[index].quantity + delta);
    setCartItems(updatedItems);

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        cart: arrayRemove({ ...cartItems[index] }),
      });
      await updateDoc(userRef, {
        cart: arrayUnion(updatedItems[index]),
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  const handleRemove = async (index) => {
    const itemToRemove = cartItems[index];
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        cart: arrayRemove(itemToRemove),
      });
      toast.error("Removed from cart!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  const handleClearCart = async () => {
    setCartItems([]);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { cart: [] });
      toast.error("Cart cleared!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf1f0] pt-28 px-4 sm:px-6 md:px-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#D9526B] mb-4 text-center">
            Your cart is empty!
          </h2>
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
      <div className="bg-[#fdf1f0] min-h-screen pt-28 pb-12 px-4 sm:px-6 md:px-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#D9526B] mb-8 text-center">
          Your Cart
        </h2>

        <div className="max-w-5xl mx-auto space-y-6">
          {cartItems.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center bg-white rounded-3xl shadow-lg p-4 sm:p-6 md:p-6 gap-4 sm:gap-6"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 object-cover rounded-2xl shadow"
              />
              <div className="flex-1 flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#D9526B]">
                    {item.name}
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base mt-1">
                    {item.desc}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mt-2">
                    {item.price}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center mt-4 gap-2 sm:gap-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(index, -1)}
                      className="bg-[#F2BBB6] px-3 sm:px-4 py-2 rounded-l-full font-bold text-[#D9526B] cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-4 sm:px-6 py-2 bg-white border-t border-b border-gray-300 text-gray-800 font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(index, 1)}
                      className="bg-[#D9526B] px-3 sm:px-4 py-2 rounded-r-full text-white font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(index)}
                    className="text-red-500 font-semibold hover:underline mt-2 sm:mt-0"
                  >
                    Remove
                  </button>

                  <button
                    onClick={() =>
                      navigate("/orders", { state: { items: [item] } })
                    }
                    className="bg-gradient-to-r from-[#F2BBB6] to-[#D9526B] text-white py-2 px-4 sm:px-6 rounded-full font-semibold mt-2 sm:mt-0 cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="max-w-5xl mx-auto mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white shadow-md rounded-3xl p-4 sm:p-6 md:p-6">
            <div className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
              Total: <span className="text-[#D9526B]">${total.toFixed(2)}</span>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mt-2 sm:mt-0">
              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white px-4 sm:px-6 py-2 rounded-full font-medium hover:opacity-90 transition cursor-pointer"
              >
                Clear Cart
              </button>
              <button
                onClick={() => navigate("/products")}
                className="bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white px-4 sm:px-6 py-2 rounded-full font-medium hover:opacity-90 transition cursor-pointer"
              >
                Browse More
              </button>

              <button
                onClick={() =>
                  navigate("/orders", { state: { items: cartItems } })
                }
                className="bg-gradient-to-r from-[#F2BBB6] to-[#D9526B] text-white px-6 sm:px-8 py-2 rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 cursor-pointer"
              >
                Buy Now (All)
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
