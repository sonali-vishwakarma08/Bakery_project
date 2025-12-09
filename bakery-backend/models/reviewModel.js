const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },

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

  comment: { type: String, required: true, trim: true }

}, { timestamps: true });

// Prevent user reviewing same product twice
reviewSchema.index(
  { user: 1, product: 1 },
  { unique: true, partialFilterExpression: { product: { $exists: true } } }
);

module.exports = mongoose.model("Review", reviewSchema);
