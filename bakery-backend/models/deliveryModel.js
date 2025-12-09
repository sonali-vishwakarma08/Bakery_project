const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },

  status: {
    type: String,
    enum: ['pending', 'baking', 'packed', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },

  rider_name: { type: String, default: null },
  rider_phone: { type: String, default: null },

  status_history: [
    {
      status: String,
      time: { type: Date, default: Date.now }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
