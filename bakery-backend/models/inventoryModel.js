const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  }, // Ingredient name (e.g., flour, sugar)
  quantity_available: { 
    type: Number, 
    required: true, 
    default: 0 
  }, // Amount in stock
  unit: { 
    type: String, 
    enum: ['kg', 'ltr', 'pcs'], 
    required: true 
  }, // Unit of measurement
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    default: null 
  }, // Reference to Category model
  low_stock_threshold: { 
    type: Number, 
    default: 5 
  } // Threshold to mark as low stock
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to check if stock is low
inventorySchema.virtual('isLowStock').get(function() {
  return this.quantity_available <= this.low_stock_threshold;
});

inventorySchema.index({ name: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
