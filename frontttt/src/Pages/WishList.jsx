import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ProductCard from "../Components/ProductCard"; // Import the new ProductCard component
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { wishlist: {}, cart: {} };
    setWishlistItems(Object.values(data.wishlist));
    setCart(Object.values(data.cart || {}));
  }, []);

  const handleWishlistToggle = (item) => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { wishlist: {}, cart: {} };
    const itemId = item._id || item.id;

    if (data.wishlist[itemId]) {
      delete data.wishlist[itemId];
      // Show success message
    } else {
      data.wishlist[itemId] = { ...item, id: itemId };
      // Show success message
    }

    localStorage.setItem("the-velvet-delights", JSON.stringify(data));
    setWishlistItems(Object.values(data.wishlist));
  };

  const handleAddToCart = (item) => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { wishlist: {}, cart: {} };
    const itemId = item._id || item.id;

    if (data.cart[itemId]) {
      navigate("/cart");
    } else {
      data.cart[itemId] = { ...item, id: itemId, quantity: 1 };
      localStorage.setItem("the-velvet-delights", JSON.stringify(data));
      setCart(Object.values(data.cart));
      // Show success message
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf1f0] pt-28 px-6 sm:px-12">
          <h2 className="text-2xl font-bold text-[#D9526B] mb-4">Your wishlist is empty!</h2>
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
        <h2 className="text-3xl font-bold text-[#D9526B] mb-8 text-center">Your Wishlist</h2>

        <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {wishlistItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              wishlist={wishlistItems}
              cart={cart}
              onWishlistToggle={handleWishlistToggle}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;