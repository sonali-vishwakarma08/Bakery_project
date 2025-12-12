const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

  // 1 User → 1 Cart
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },

  items: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },

      quantity: { 
        type: Number, 
        default: 1, 
        min: 1 
      },

      // Price snapshot when added to cart
      price_at_adding: { 
        type: Number, 
        required: true,
        min: 0
      },

      // Bakery customizations
      flavor: { type: String, default: null },
      weight: { type: String, default: null },
      custom_message: { type: String, default: '' },
      
      // Custom cake specific fields
      is_custom_cake: { type: Boolean, default: false },
      reference_image: { type: String, default: null },
      shape: { type: String, default: null },
      delivery_date: { type: Date, default: null },
      special_instructions: { type: String, default: '' },

      added_at: { 
        type: Date, 
        default: Date.now 
      }
    }
  ],
  
  // Applied coupon
  applied_coupon: { 
    code: String, 
    discount_amount: Number 
  },
  
  // Notes
  notes: { type: String, default: '' }

}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// ⭐ Total Quantity (for header cart icon)
cartSchema.methods.getTotalQuantity = function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
};


// ⭐ Total Cart Value (auto recalculated)
cartSchema.virtual('totalAmount').get(function () {
  return this.items.reduce(
    (sum, item) => sum + item.quantity * (item.price_at_adding || 0),
    0
  );
});

module.exports = mongoose.model('Cart', cartSchema);
