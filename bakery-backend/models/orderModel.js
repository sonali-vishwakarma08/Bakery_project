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
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },

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
  total_amount: { type: Number, required: true },
  discount_amount: { type: Number, default: 0 },
  final_amount: { type: Number, required: true },

  // Coupon
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },

  // Payment
  payment_status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },

  payment_method: {
    type: String,
    enum: ['razorpay', 'upi', 'card', 'cod'],
    default: 'cod'
  },

  // Delivery
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'baking', 'packed', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },

  delivery_address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    phone: String
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
