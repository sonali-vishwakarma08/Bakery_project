const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  gateway: { type: String, enum: ['razorpay'], default: 'razorpay' },

  gateway_order_id: { type: String, index: true },
  gateway_payment_id: { type: String, index: true },
  gateway_signature: { type: String },

  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },

  payment_method: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cod'],
    default: 'upi'
  },

  payment_status: {
    type: String,
    enum: ['created', 'pending', 'success', 'failed'],
    default: 'created'
  },

  is_verified: { type: Boolean, default: false },

  paid_at: { type: Date, default: null }

}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
