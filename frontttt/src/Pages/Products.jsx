import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_ENDPOINTS, getImageUrl } from "../config/apiConfig";

const Products = () => {
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { wishlist: {}, cart: {} };
    setWishlist(Object.values(data.wishlist || {}));
    setCart(Object.values(data.cart || {}));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_ENDPOINTS.PRODUCTS.BASE}?status=active&limit=100`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
      toast.error("Failed to load products. Please try again later.");
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

  const handleCartAction = (item) => {
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


  // Helper function to format price
  const formatPrice = (price, discount = 0) => {
    const finalPrice = price - (price * discount / 100);
    return `$${finalPrice.toFixed(2)}`;
  };

  // Filter products based on search
  const filteredProducts = products.filter((item) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.price?.toString().includes(query)
    );
  });

  return (
    <div>
      <Header wishlist={wishlist} cart={cart} />
      <div className="bg-[#fdf1f0] min-h-screen pt-28 pb-12 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto mb-10 bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-center text-[#D9526B] font-semibold text-xl mb-3">
            Find Your Favorite Treat
          </h2>
          <input
            type="text"
            placeholder="Search for your favorite treat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-full shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D9526B] text-gray-700"
          />
        </div>

        {/* Custom Cake Section */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Custom Cake Ordering</h2>
                <p className="mb-4 opacity-90">
                  Design your perfect cake with our custom ordering service. Choose flavors, shapes, and add personal messages.
                </p>
                <button
                  onClick={() => navigate("/custom-cake")}
                  className="bg-white text-pink-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition shadow-md"
                >
                  Create Custom Cake
                </button>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-white/20 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="max-w-7xl mx-auto text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9526B]"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="max-w-7xl mx-auto text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-6 py-2 bg-[#D9526B] text-white rounded-full hover:opacity-90 transition"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="max-w-7xl mx-auto text-center py-20">
            <p className="text-gray-600 text-lg">
              {search ? "No products found matching your search." : "No products available at the moment."}
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((item) => {
              const isInWishlist = wishlist.some((i) => i.id === item._id || i._id === item._id);
              const isInCart = cart.some((i) => i.id === item._id || i._id === item._id);
              const productImage = item.images && item.images.length > 0 ? item.images[0] : null;

              return (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`, { state: item })}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col justify-between cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={getImageUrl(productImage)}
                      alt={item.name}
                      className="h-48 w-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    {item.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-[#D9526B] text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {item.discount}% OFF
                      </div>
                    )}
                    <FaHeart
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(item);
                      }}
                      className={`absolute top-3 right-3 text-xl cursor-pointer transition ${
                        isInWishlist ? "text-[#D9526B]" : "text-white"
                      }`}
                    />
                  </div>

                  <div className="p-5 text-center flex-grow">
                    <h3 className="text-lg font-semibold text-[#D9526B]">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {item.description || "No description available"}
                    </p>
                    <div className="mt-2">
                      {item.discount > 0 ? (
                        <div>
                          <span className="text-gray-400 line-through text-sm mr-2">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-gray-800 font-bold">
                            {formatPrice(item.price, item.discount)}
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-800 font-bold">
                          ${item.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCartAction(item);
                      }}
                      className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white font-medium rounded-full py-2 hover:opacity-90 transition cursor-pointer"
                    >
                      {isInCart ? "Go to Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Products;