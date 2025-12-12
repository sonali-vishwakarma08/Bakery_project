import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";
import { wishlistAPI, SERVER_BASE_URL } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { getImageUrl } from "../config/apiConfig";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const formatCurrency = (amount) => {
    const validAmount = isNaN(parseFloat(amount)) ? 0 : parseFloat(amount);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(validAmount);
  };

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        const res = await wishlistAPI.get();
        const list = (res.data || res).map((w) => {
          const p = w.product || {};
          return {
            id: p._id,
            name: p.name,
            price: p.price,
            image: p.images?.[0] ? `${SERVER_BASE_URL}/uploads/products/${p.images[0]}` : null,
          };
        });
        setFavorites(list);
      } catch (error) {
        console.warn("Failed to load wishlist", error);
        toast.error("Failed to load wishlist");
        const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { wishlist: {}, cart: {} };
        setFavorites(Object.values(data.wishlist || {}));
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

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
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <button
                onClick={() => navigate("/profile")}
                className="text-pink-600 hover:text-pink-800 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Profile
              </button>
            </div>

            {favorites.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 p-10 text-center">
                <div className="text-6xl mb-5">🤍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Favorites Yet</h3>
                <p className="text-gray-600 mb-7 max-w-md mx-auto">Save your favorite bakery items to find them later!</p>
                <button
                  onClick={() => navigate("/products")}
                  className="px-7 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favorites.map((item) => {
                  const imageUrl = item.image 
                    ? getImageUrl(item.image) 
                    : item.images?.[0] 
                      ? getImageUrl(`products/${item.images[0]}`) 
                      : null;
                  return (
                    <div 
                      key={item.id || item._id} 
                      className="rounded-2xl border p-4 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => navigate(`/product/${item.id || item._id}`)}
                    >
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={item.name} 
                          className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='8' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="text-gray-400" size={32} />
                        </div>
                      )}
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-pink-600 font-bold text-lg mt-2">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      
                      <button
                        className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Added to cart!");
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}