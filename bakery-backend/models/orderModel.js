const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    priceAtPurchase: Number
  }],
  totalAmount: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'baking', 'ready', 'delivered', 'cancelled'], default: 'pending' },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zip: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);