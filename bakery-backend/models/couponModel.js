const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discount_type: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
  discount_value: { type: Number, required: true },
  start_date: { type: Date, required: true },
  expiry_date: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'disabled'], default: 'active' },

  // Optional usage & restrictions
  isOneTimeUse: { type: Boolean, default: false }, // one use per user
  usage_limit: { type: Number, default: 0 },        // max uses overall
  used_count: { type: Number, default: 0 },        // times used
  applicable_categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  applicable_products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

// Static method to expire old coupons
couponSchema.statics.expireOldCoupons = async function () {
  const now = new Date();
  await this.updateMany(
    { expiry_date: { $lt: now }, status: 'active' },
    { status: 'expired' }
  );
};

module.exports = mongoose.model('Coupon', couponSchema);
