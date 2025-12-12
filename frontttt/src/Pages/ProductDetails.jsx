import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { reviewsService } from "../services/apiService";
import { getImageUrl } from "../config/apiConfig";
import { FaStar } from "react-icons/fa";

const ProductDetails = () => {
  const { state: product } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { wishlist: {}, cart: {} };
    setCart(Object.values(data.cart || {}));
    
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
  const productImage = product?.images?.[0] 
    ? getImageUrl(`products/${product.images[0]}`)
    : product?.image 
      ? getImageUrl(product.image)
      : '/placeholder-image.jpg';
    
  const { name, desc, price, _id } = product || {};
  const productId = _id || id;
  const isInCart = cart.some((i) => i.id === productId || i._id === productId);

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

  return (
    <div>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen pt-28 pb-12 px-6 sm:px-12">
        {/* Product Details Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 mb-12">
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src={productImage}
              alt={name}
              className="rounded-3xl shadow-lg w-80 sm:w-96 object-cover"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='8' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 w-full lg:w-1/2 border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#D9526B] mb-3">{name}</h2>
            <p className="text-gray-700 text-sm sm:text-base mb-4">{desc}</p>
            <p className="text-xl font-semibold text-gray-900 mb-6">{price}</p>

            <div className="flex items-center mb-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-[#F2BBB6] px-4 py-2 rounded-l-full font-bold text-[#D9526B]"
              >
                −
              </button>
              <span className="px-6 py-2 bg-white border-t border-b text-gray-800 font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-[#D9526B] px-4 py-2 rounded-r-full text-white font-bold cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              onClick={handleCartAction}
              className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white cursor-pointer py-3 rounded-full font-medium hover:opacity-90 transition mb-4"
            >
              {isInCart ? "Go to Cart" : "Add to Cart"}
            </button>

            <button
              onClick={() => navigate("/products")}
              className="w-full border border-[#D9526B] text-[#D9526B] py-3 rounded-full font-medium hover:bg-[#fdf1f0] transition"
            >
              ← Back to Products
            </button>
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
            <div className="space-y-4 mb-6">
              {reviews.map((review, idx) => (
                <div key={idx} className="border-l-4 border-[#D9526B] pl-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment || review.text}</p>
                  <p className="text-sm text-gray-500 mt-1">by {review.user?.name || "Anonymous"}</p>
                </div>
              ))}
            </div>
          )}

          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-2 rounded-full font-medium hover:opacity-90 transition"
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
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#D9526B]"
                rows="4"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="flex-1 bg-[#D9526B] text-white py-2 rounded-full font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 border border-[#D9526B] text-[#D9526B] py-2 rounded-full font-medium hover:bg-[#fdf1f0] transition"
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
