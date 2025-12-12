const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ''
    },

    discount_type: {
      type: String,
      enum: ["percentage", "flat"],
      default: "percentage"
    },

    discount_value: {
      type: Number,
      required: true,
      min: 1
    },

    // For percentage discounts, maximum discount amount
    max_discount_amount: {
      type: Number,
      default: 0 // 0 = no limit
    },

    start_date: {
      type: Date,
      required: true
    },

    expiry_date: {
      type: Date,
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["active", "expired", "disabled"],
      default: "active"
    },

    // Minimum order amount for coupon to be applicable
    min_order_amount: {
      type: Number,
      default: 0
    },

    // Usage restrictions
    isOneTimeUse: {
      type: Boolean,
      default: false // one-time per user
    },

    usage_limit: {
      type: Number,
      default: 0 // 0 = unlimited
    },

    used_count: {
      type: Number,
      default: 0
    },

    // Apply coupon only on specific categories
    applicable_categories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
    ],

    // Apply coupon only on specific products
    applicable_products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    ],

    // Exclude specific products
    excluded_products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    ],

    // Created by admin
    created_by: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }
  },
  { timestamps: true }
);

/* ----------------------------------
   VALIDATION: ensure start < expiry
---------------------------------- */
couponSchema.pre("save", function (next) {
  if (this.start_date >= this.expiry_date) {
    return next(new Error("Start date must be before expiry date"));
  }
  next();
});

/* ----------------------------------
   STATIC: expire coupons automatically
---------------------------------- */
couponSchema.statics.expireOldCoupons = async function () {
  const now = new Date();
  return await this.updateMany(
    { expiry_date: { $lt: now }, status: "active" },
    { status: "expired" }
  );
};

/* ----------------------------------
   VIRTUAL: check if coupon is usable right now
---------------------------------- */
couponSchema.virtual("isValidNow").get(function () {
  const now = new Date();
  return (
    this.status === "active" &&
    now >= this.start_date &&
    now <= this.expiry_date &&
    (this.usage_limit === 0 || this.used_count < this.usage_limit)
  );
});

module.exports = mongoose.model("Coupon", couponSchema);
