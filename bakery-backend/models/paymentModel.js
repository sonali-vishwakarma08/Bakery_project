const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  gateway: { 
    type: String, 
    enum: ['razorpay', 'stripe', 'paypal', 'paytm'], 
    default: 'razorpay' 
  },

  gateway_order_id: { type: String, index: true },
  gateway_payment_id: { type: String, index: true },
  gateway_signature: { type: String },
  
  // For storing additional gateway response data
  gateway_response: { type: mongoose.Schema.Types.Mixed },

  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  
  // Tax and fee breakdown
  tax_amount: { type: Number, default: 0 },
  convenience_fee: { type: Number, default: 0 },

  payment_method: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cod', 'paypal', 'paytm'],
    default: 'upi'
  },
  
  // Card details (if applicable)
  card_last_four: { type: String },
  card_brand: { type: String },

  payment_status: {
    type: String,
    enum: ['created', 'pending', 'success', 'failed', 'refunded', 'partially_refunded'],
    default: 'created'
  },
  
  // Refund information
  refund_id: { type: String },
  refund_amount: { type: Number, default: 0 },
  refund_reason: { type: String },

  is_verified: { type: Boolean, default: false },

  paid_at: { type: Date, default: null },
  refunded_at: { type: Date, default: null }

}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
