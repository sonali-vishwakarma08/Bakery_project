const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({

  order_code: { 
    type: String,
    unique: true,
    default: () => `BKR-${new Date().toISOString().slice(0,10)}-${uuidv4().slice(0,6)}`
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Items added to order
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1, min: 1 },
      price: { type: Number, required: true, min: 0 },

      // Bakery customization
      flavor: { type: String, default: null },
      weight: { type: String, default: null },
      custom_message: { type: String, default: '' }

    }
  ],

  // Custom Cakes (Optional)
  is_custom_cake: { type: Boolean, default: false },
  reference_image: { type: String, default: null },
  shape: { type: String, default: null },      // round, square, heart shape etc.
  delivery_date: { type: Date, default: null },
  special_instructions: { type: String, default: '' },

  // Amounts
  subtotal_amount: { type: Number, required: true, min: 0 },
  tax_amount: { type: Number, default: 0, min: 0 },
  discount_amount: { type: Number, default: 0, min: 0 },
  delivery_charge: { type: Number, default: 0, min: 0 },
  final_amount: { type: Number, required: true, min: 0 },

  // Coupon
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
  coupon_code: { type: String },

  // Payment
  payment_status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },

  payment_method: {
    type: String,
    enum: ['razorpay', 'upi', 'card', 'cod', 'paypal'],
    default: 'cod'
  },

  payment_id: { type: String }, // Store payment gateway transaction ID

  // Delivery
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'baking', 'packed', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },

  delivery_address: {
    name: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    phone: String
  },

  // Timestamps for order status changes
  confirmed_at: { type: Date, default: null },
  baking_started_at: { type: Date, default: null },
  packed_at: { type: Date, default: null },
  out_for_delivery_at: { type: Date, default: null },
  delivered_at: { type: Date, default: null },
  cancelled_at: { type: Date, default: null },

  // Notes
  admin_notes: { type: String, default: '' }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
