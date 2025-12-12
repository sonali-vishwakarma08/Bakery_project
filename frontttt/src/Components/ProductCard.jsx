import React from "react";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductCard = ({ 
  item, 
  wishlist = [], 
  cart = [], 
  onWishlistToggle, 
  onAddToCart 
}) => {
  const navigate = useNavigate();
  
  // Check if item is in wishlist or cart
  const isInWishlist = wishlist.some((i) => i.id === item._id || i._id === item._id);
  const isInCart = cart.some((i) => i.id === item._id || i._id === item._id);
  
  // Get product image
  const productImage = item.images && item.images.length > 0 ? 
    `http://localhost:5000/uploads/products/${item.images[0]}` : 
    "https://via.placeholder.com/400x300?text=No+Image";
  
  // Format price
  const formatPrice = (price, discount = 0) => {
    const finalPrice = price - (price * discount / 100);
    return `$${finalPrice.toFixed(2)}`;
  };
  
  // Calculate average rating (mock data for now)
  const averageRating = item.averageRating || 4.5;
  const reviewCount = item.reviewCount || 12;
  
  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 text-sm" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300 text-sm" />);
    }
    
    return stars;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full border border-gray-100 hover:border-pink-200">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={productImage}
          alt={item.name}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
        
        {/* Discount Badge */}
        {item.discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
            {item.discount}% OFF
          </div>
        )}
        
        {/* Wishlist Heart */}
        <FaHeart
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(item);
          }}
          className={`absolute top-3 right-3 text-xl cursor-pointer transition-all duration-300 transform hover:scale-110 ${
            isInWishlist 
              ? "text-pink-500 drop-shadow-lg" 
              : "text-white drop-shadow-md hover:text-pink-300"
          }`}
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${item._id}`, { state: item });
            }}
            className="bg-white text-pink-600 px-4 py-2 rounded-full font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg hover:bg-pink-50"
          >
            Quick View
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
            {item.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.description || "Delicious bakery item"}
          </p>
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex">
              {renderStars(averageRating)}
            </div>
            <span className="text-gray-500 text-xs ml-2">
              ({reviewCount})
            </span>
          </div>
          
          {/* Price */}
          <div className="mb-4">
            {item.discount > 0 ? (
              <div className="flex items-center">
                <span className="text-gray-400 line-through text-sm mr-2">
                  ${item.price?.toFixed(2)}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(item.price, item.discount)}
                </span>
              </div>
            ) : (
              <p className="text-lg font-bold text-gray-900">
                ${item.price?.toFixed(2)}
              </p>
            )}
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item);
          }}
          className={`w-full py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            isInCart
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
              : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:shadow-lg"
          }`}
        >
          <FaShoppingCart />
          {isInCart ? "Go to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;