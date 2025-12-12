const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  quantity_available: { type: Number, default: 0, min: 0 },
  min_stock_level: { type: Number, default: 5 }, // Alert when stock falls below this level

  unit: { 
    type: String,
    enum: ['kg', 'ltr', 'pcs', 'g', 'ml'],
    required: true 
  },

  // Cost tracking
  cost_per_unit: { type: Number, default: 0 },

  // Supplier information
  supplier: { type: String, default: '' },
  supplier_contact: { type: String, default: '' },

  // Expiry tracking for perishable items
  expiry_date: { type: Date, default: null },

  // Category for reporting
  category: { 
    type: String, 
    enum: ['flour', 'sugar', 'dairy', 'eggs', 'fruits', 'nuts', 'chocolate', 'spices', 'other'],
    default: 'other' 
  },

  status: { 
    type: String, 
    enum: ['available', 'low_stock', 'out_of_stock', 'expired'], 
    default: 'available' 
  }

}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
