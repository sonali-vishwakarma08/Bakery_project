const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // Link to order for verification

  type: {
    type: String,
    enum: ["review", "feedback"],
    default: "review"
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: function () {
      return this.type === "review";
    }
  },

  // Detailed ratings for different aspects
  quality_rating: { type: Number, min: 1, max: 5 },
  taste_rating: { type: Number, min: 1, max: 5 },
  packaging_rating: { type: Number, min: 1, max: 5 },

  comment: { type: String, required: true, trim: true },

  // Images of the product
  images: [String],

  // Verified purchase flag
  is_verified_purchase: { type: Boolean, default: false },

  // Approval status for admin moderation
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },

  // Helpful votes
  helpful_votes: { type: Number, default: 0 },
  not_helpful_votes: { type: Number, default: 0 }

}, { timestamps: true });

// Prevent user reviewing same product twice
reviewSchema.index(
  { user: 1, product: 1 },
  { unique: true, partialFilterExpression: { product: { $exists: true } } }
);

module.exports = mongoose.model("Review", reviewSchema);
