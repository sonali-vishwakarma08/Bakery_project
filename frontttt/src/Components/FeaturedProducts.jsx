import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/apiConfig";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { wishlist: {}, cart: {} };
    setWishlist(Object.values(data.wishlist || {}));
    setCart(Object.values(data.cart || {}));
    
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.PRODUCTS.BASE}?status=active&limit=8`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching featured products:", err);
      toast.error("Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = (item) => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { wishlist: {}, cart: {} };
    const itemId = item._id || item.id;

    if (data.wishlist[itemId]) {
      delete data.wishlist[itemId];
      toast.success("Removed from wishlist");
    } else {
      data.wishlist[itemId] = { ...item, id: itemId };
      toast.success("Added to wishlist");
    }

    localStorage.setItem("the-velvet-delights", JSON.stringify(data));
    setWishlist(Object.values(data.wishlist));
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
      toast.success("Added to Cart!");
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-[#fdf1f0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#D9526B]">Featured Products</h2>
            <p className="text-gray-600 mt-2">Our most popular bakery items</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-[#fdf1f0]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#D9526B]">Featured Products</h2>
          <p className="text-gray-600 mt-2">Our most popular bakery items</p>
        </div>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((item) => (
              <ProductCard
                key={item._id}
                item={item}
                wishlist={wishlist}
                cart={cart}
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available at the moment.</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 bg-[#D9526B] text-white px-6 py-2 rounded-full hover:opacity-90 transition"
            >
              Browse All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;