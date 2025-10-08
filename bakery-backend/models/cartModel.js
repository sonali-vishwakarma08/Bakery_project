const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 }
    }
  ]
}, { timestamps: true });

// Optional convenience method to get total quantity
cartSchema.methods.getTotalQuantity = function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
};

module.exports = mongoose.model('Cart', cartSchema);
