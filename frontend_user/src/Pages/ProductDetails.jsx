import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const ProductDetails = () => {
  const { state: product } = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUser(user);
      const fetchCart = async () => {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          setCart(snapshot.data().cart || []);
        }
      };
      fetchCart();
    }
  }, [auth.currentUser]);

  if (!product) {
    return (
      <div className="text-center mt-28 text-red-500 text-xl">
        No product found!
      </div>
    );
  }

  const { image, name, desc, price, id } = product;
  const isInCart = cart.some((i) => i.id === id);

  const handleCartAction = async () => {
    if (!currentUser) {
      toast.error("Please login to add to cart!");
      navigate("/login");
      return;
    }

    const userRef = doc(db, "users", currentUser.uid);

    if (isInCart) {
      navigate("/cart");
      return;
    }

    try {
      const productWithQuantity = { ...product, quantity };
      await updateDoc(userRef, {
        cart: arrayUnion(productWithQuantity),
      });

      setCart([...cart, productWithQuantity]); 
      toast.success("Added to Cart!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen pt-28 pb-12 px-6 sm:px-12 flex flex-col lg:flex-row items-center justify-center gap-10">
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={image}
            alt={name}
            className="rounded-3xl shadow-lg w-72 sm:w-96 md:w-[400px] object-cover"
          />
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 w-full lg:w-1/2 border border-gray-100 flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#D9526B]">
            {name}
          </h2>

          <p className="text-gray-700 text-sm sm:text-base line-clamp-3">
            {desc}
          </p>

          <p className="text-xl font-semibold text-gray-900">{price}</p>

          <div className="flex items-center w-max border border-gray-300 rounded-full overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-[#F2BBB6] px-4 py-2 font-bold text-[#D9526B] hover:bg-[#e49fa0] transition cursor-pointer"
            >
              −
            </button>
            <span className="px-6 py-2 bg-white border-x border-gray-300 text-gray-800 font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-[#D9526B] px-4 py-2 text-white font-bold hover:opacity-90 transition cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            onClick={handleCartAction}
            className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-3 rounded-full font-medium hover:opacity-90 transition cursor-pointer"
          >
            {isInCart ? "Go to Cart" : "Add to Cart"}
          </button>

          <button
            onClick={() => navigate("/products")}
            className="w-full border border-[#D9526B] text-[#D9526B] py-3 rounded-full font-medium hover:bg-[#fdf1f0] transition cursor-pointer"
          >
            ← Back to Products
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
