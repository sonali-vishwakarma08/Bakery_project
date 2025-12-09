const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },

  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },

  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },

  stock_quantity: { type: Number, default: 0 },

  images: [String],

  weight_options: { type: String },
  flavors: { type: String },


  preparation_time: { type: Number, default: 30 },

  is_custom_message_allowed: { type: Boolean, default: false },
  custom_message_max_length: { type: Number, default: 40 },

  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },

  status: { type: String, enum: ['active', 'inactive'], default: 'active' }

}, { timestamps: true });

productSchema.virtual('finalPrice').get(function () {
  return this.price - (this.price * this.discount / 100);
});

module.exports = mongoose.model('Product', productSchema);
