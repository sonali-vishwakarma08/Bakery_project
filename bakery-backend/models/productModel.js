const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // percentage discount
  stock_quantity: { type: Number, default: 0 },
  images: [String],
  is_featured: { type: Boolean, default: false, index: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field to calculate final price after discount
productSchema.virtual('finalPrice').get(function() {
  return this.price - (this.price * this.discount / 100);
});

module.exports = mongoose.model('Product', productSchema);
