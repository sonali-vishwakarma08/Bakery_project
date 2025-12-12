const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },

  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', index: true },

  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },

  stock_quantity: { type: Number, default: 0, min: 0 },

  images: [String],

  weight_options: [{ 
    value: String, 
    label: String 
  }],
  flavors: [{ 
    value: String, 
    label: String 
  }],

  preparation_time: { type: Number, default: 30, min: 0 }, // in minutes

  is_custom_message_allowed: { type: Boolean, default: false },
  custom_message_max_length: { type: Number, default: 40 },

  // Bakery-specific fields
  is_customizable: { type: Boolean, default: false },
  is_vegetarian: { type: Boolean, default: true },
  allergens: [{ type: String }], // e.g., nuts, dairy, gluten
  ingredients: [{ type: String }],
  shelf_life: { type: Number }, // in days

  ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0, min: 0 },

  status: { type: String, enum: ['active', 'inactive'], default: 'active' }

}, { timestamps: true });

productSchema.virtual('finalPrice').get(function () {
  return this.price - (this.price * this.discount / 100);
});

module.exports = mongoose.model('Product', productSchema);
