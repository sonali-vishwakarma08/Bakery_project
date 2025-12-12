import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { reviewsService } from "../services/apiService";
import { getImageUrl } from "../config/apiConfig";
import { FaStar, FaHeart, FaShoppingCart, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductDetails = () => {
  const { state: product } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { wishlist: {}, cart: {} };
    setCart(Object.values(data.cart || {}));
    setWishlist(Object.values(data.wishlist || {}));
    
    // Load reviews
    const loadReviews = async () => {
      try {
        setLoadingReviews(true);
        const productId = product?._id || id;
        if (productId) {
          const data = await reviewsService.getProductReviews(productId);
          setReviews(Array.isArray(data) ? data : data.reviews || []);
        }
      } catch (err) {
        console.warn("Failed to load reviews", err);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };
    
    loadReviews();
  }, [product, id]);

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      setSubmittingReview(true);
      const productId = product?._id || id;
      await reviewsService.addReview(productId, {
        rating,
        comment: reviewText,
      });
      toast.success("Review submitted successfully!");
      setReviewText("");
      setRating(5);
      setShowReviewForm(false);
      // Reload reviews
      const data = await reviewsService.getProductReviews(productId);
      setReviews(Array.isArray(data) ? data : data.reviews || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!product) {
    return <div className="text-center mt-20 text-red-500">No product found!</div>;
  }

  // Construct proper image URL
  const productImages = product?.images?.length > 0 
    ? product.images.map(img => getImageUrl(`products/${img}`))
    : [product?.image ? getImageUrl(product.image) : '/placeholder-image.jpg'];
    
  const { name, description, price, _id, discount } = product || {};
  const productId = _id || id;
  const isInCart = cart.some((i) => i.id === productId || i._id === productId);
  const isInWishlist = wishlist.some((i) => i.id === productId || i._id === productId);

  const handleCartAction = () => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { wishlist: {}, cart: {} };

    if (data.cart[productId]) {
      navigate("/cart");
    } else {
      data.cart[productId] = { ...product, quantity, id: productId, _id: productId };
      localStorage.setItem("the-velvet-delights", JSON.stringify(data));
      setCart(Object.values(data.cart));
      toast.success("Added to Cart!");
    }
  };

  const handleWishlistToggle = () => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { wishlist: {}, cart: {} };

    if (data.wishlist[productId]) {
      delete data.wishlist[productId];
      toast.success("Removed from wishlist");
    } else {
      data.wishlist[productId] = { ...product, id: productId, _id: productId };
      toast.success("Added to wishlist!");
    }

    localStorage.setItem("the-velvet-delights", JSON.stringify(data));
    setWishlist(Object.values(data.wishlist));
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  };

  // Calculate discounted price
  const finalPrice = discount ? price - (price * discount / 100) : price;

  return (
    <div>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen pt-28 pb-12 px-6 sm:px-12">
        {/* Product Details Section */}
        <div className="flex flex-col lg:flex-row gap-10 mb-12">
          {/* Product Images */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden">
              <img
                src={productImages[currentImageIndex]}
                alt={`${name} - Image ${currentImageIndex + 1}`}
                className="w-full h-96 sm:h-[500px] object-contain"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='8' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                }}
              />
              
              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-3 shadow-md hover:bg-opacity-100 transition"
                  >
                    <FaChevronLeft className="text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-3 shadow-md hover:bg-opacity-100 transition"
                  >
                    <FaChevronRight className="text-gray-800" />
                  </button>
                </>
              )}
              
              {/* Image Indicators */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? "bg-[#D9526B]" : "bg-white bg-opacity-50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex mt-4 space-x-3 overflow-x-auto py-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? "border-[#D9526B]" : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{name}</h2>
              
              <p className="text-gray-700 text-base mb-6">{description}</p>
              
              {/* Price */}
              <div className="mb-6">
                {discount ? (
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-gray-900">${finalPrice.toFixed(2)}</span>
                    <span className="text-xl text-gray-500 line-through">${price.toFixed(2)}</span>
                    <span className="bg-[#D9526B] text-white text-sm font-bold px-3 py-1 rounded-full">
                      {discount}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">${price.toFixed(2)}</span>
                )}
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-[#F2BBB6] w-12 h-12 flex items-center justify-center rounded-l-full font-bold text-[#D9526B] hover:bg-[#e0a9a2] transition"
                  >
                    −
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center bg-white border-t border-b text-gray-800 font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-[#D9526B] w-12 h-12 flex items-center justify-center rounded-r-full text-white font-bold hover:bg-[#c24257] transition"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleCartAction}
                  className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-4 rounded-full font-bold text-lg hover:opacity-90 transition flex items-center justify-center gap-3 shadow-lg"
                >
                  <FaShoppingCart />
                  {isInCart ? "Go to Cart" : "Add to Cart"}
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className={`w-full py-4 rounded-full font-bold text-lg transition flex items-center justify-center gap-3 border-2 ${
                    isInWishlist
                      ? "bg-pink-50 border-pink-500 text-pink-600"
                      : "bg-white border-gray-300 text-gray-700 hover:border-pink-300"
                  }`}
                >
                  <FaHeart className={isInWishlist ? "text-pink-500" : ""} />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
                
                <button
                  onClick={() => navigate("/products")}
                  className="w-full border border-[#D9526B] text-[#D9526B] py-4 rounded-full font-bold text-lg hover:bg-[#fdf1f0] transition flex items-center justify-center gap-3"
                >
                  ← Back to Products
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-[#D9526B] mb-6">⭐ Customer Reviews</h3>

          {loadingReviews ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D9526B]"></div>
              <p className="mt-2 text-gray-600">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-6 mb-8">
              {reviews.map((review, idx) => (
                <div key={idx} className="border-l-4 border-[#D9526B] pl-4 py-4 bg-gray-50 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`${i < (review.rating || 5) ? "text-yellow-400" : "text-gray-300"} text-sm`} 
                      />
                    ))}
                    <span className="text-gray-700 font-medium ml-2">{review.user?.name || "Anonymous"}</span>
                  </div>
                  <p className="text-gray-700">{review.comment || review.text}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.createdAt || review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-3 rounded-full font-bold hover:opacity-90 transition"
            >
              ✍️ Write a Review
            </button>
          ) : (
            <div className="border-t pt-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${ rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                className="w-full border border-gray-300 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-[#D9526B]"
                rows="4"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="flex-1 bg-[#D9526B] text-white py-3 rounded-full font-bold hover:opacity-90 transition disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 border border-[#D9526B] text-[#D9526B] py-3 rounded-full font-bold hover:bg-[#fdf1f0] transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;