const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  quantity_available: { type: Number, default: 0 },

  unit: { 
    type: String,
    enum: ['kg', 'ltr', 'pcs'],
    required: true 
  },

}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
