const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false // Optional for general feedback (no product linked)
  },

  type: {
    type: String,
    enum: ["review", "feedback"], // "review" = product review, "feedback" = general site feedback
    default: "review"
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: function () {
      return this.type === "review"; // Rating required only for product reviews
    }
  },

  comment: {
    type: String,
    required: true,
    trim: true
  },

  reply: {
    type: String,
    default: null // Admin response for feedback
  },

  helpful_count: {
    type: Number,
    default: 0 // Users can upvote helpful reviews
  }

}, { timestamps: true });

// ✅ Indexes for faster lookups
reviewSchema.index({ user: 1 });
reviewSchema.index({ product: 1 });

// ✅ Prevent duplicate reviews by same user for same product
reviewSchema.index(
  { user: 1, product: 1 },
  { unique: true, partialFilterExpression: { product: { $exists: true } } }
);

module.exports = mongoose.model("Review", reviewSchema);
