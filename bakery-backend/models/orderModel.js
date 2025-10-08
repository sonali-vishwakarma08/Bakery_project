const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // for generating unique order codes

const orderSchema = new mongoose.Schema({
  order_code: { 
    type: String, 
    unique: true, 
    default: () => `BKR-${new Date().toISOString().slice(0,10)}-${uuidv4().slice(0,6)}` 
  },

  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true } // price at purchase
    }
  ],

  total_amount: { type: Number, required: true },
  discount_amount: { type: Number, default: 0 }, // applied discount in ₹
  delivery_fee: { type: Number, default: 0 },    // delivery charges

  // Payment details
  payment_status: { 
    type: String, 
    enum: ['pending', 'success', 'failed'], 
    default: 'pending' 
  },
  payment_method: { 
    type: String, 
    enum: ['card', 'upi', 'netbanking', 'cod'], 
    default: 'cod' 
  },

  // Order progress
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'baked', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'pending', 
    index: true 
  },

  // Delivery information
  delivery_address: { 
    street: String,
    city: String,
    state: String,
    zip: String,
    phone: String
  },
  expected_delivery_time: { type: Date },

  // Optional notes
  notes: { type: String, default: '' },
  isGift: { type: Boolean, default: false },
  giftMessage: { type: String, default: '' },

  // Coupons & staff
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
  delivery_staff: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryStaff', default: null },

  // Order source
  order_source: { 
    type: String, 
    enum: ['web', 'mobile', 'walk-in'], 
    default: 'web' 
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
