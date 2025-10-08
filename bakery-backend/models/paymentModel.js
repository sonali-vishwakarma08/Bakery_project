const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  payment_method: { 
    type: String, 
    enum: ['card', 'netbanking', 'upi', 'wallet', 'cash'], 
    default: 'card' 
  },
  payment_status: { 
    type: String, 
    enum: ['pending', 'success', 'failed', 'refunded'], 
    default: 'pending',
    index: true 
  },
  transaction_id: { 
    type: String, 
    trim: true, 
    unique: true, 
    sparse: true 
  },
  gateway_response: { 
    type: mongoose.Schema.Types.Mixed, 
    default: null 
  },
  paid_at: { 
    type: Date, 
    default: null 
  },
  currency: { 
    type: String, 
    default: 'INR' 
  },
  is_verified: { 
    type: Boolean, 
    default: false 
  },
  error_message: { 
    type: String, 
    trim: true, 
    default: null 
  }
}, { timestamps: true });

// Indexes for fast lookup
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
