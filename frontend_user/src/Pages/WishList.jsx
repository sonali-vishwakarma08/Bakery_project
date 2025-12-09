import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; 
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  const user = auth.currentUser;

  const fetchWishlist = async () => {
    if (!user) return; 
    
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      setWishlistItems(snapshot.data().wishlist || []);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const handleRemove = async (item) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        wishlist: arrayRemove(item),
      });
      toast.error("Removed from wishlist!", { position: "top-center" });
      fetchWishlist(); 
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  if (!user) {
    return (
      <div className="pt-28 text-center text-red-600 text-xl">
        Please log in to view wishlist!
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf1f0] pt-28 px-6 sm:px-12">
          <h2 className="text-2xl font-bold text-[#D9526B] mb-4">
            Your wishlist is empty!
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

  return (
    <div>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen pt-28 pb-12 px-6 sm:px-12">
        <h2 className="text-3xl font-bold text-[#D9526B] mb-8 text-center">
          Your Wishlist
        </h2>

        <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden relative"
            >
              <FaHeart
                className="absolute top-3 right-3 text-red-500 text-xl cursor-pointer"
                onClick={() => handleRemove(item)}
              />

              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover"
              />

              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-[#D9526B]">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {item.desc}
                </p>
                <p className="text-gray-800 font-bold mt-2">
                  {item.price}
                </p>

                <button
                  onClick={() => handleRemove(item)}
                  className="mt-3 bg-red-500 text-white py-2 px-4 rounded-full hover:opacity-90 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
