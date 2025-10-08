const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantityInStock: Number,
  restockThreshold: Number
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);