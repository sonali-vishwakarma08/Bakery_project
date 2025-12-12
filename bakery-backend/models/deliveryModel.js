const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },

  delivery_staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'baking', 'packed', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },

  rider_name: { type: String, default: null },
  rider_phone: { type: String, default: null },
  rider_assigned_at: { type: Date, default: null },

  // Location tracking
  current_location: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    updated_at: { type: Date, default: null }
  },

  estimated_delivery_time: { type: Date, default: null },

  status_history: [
    {
      status: String,
      time: { type: Date, default: Date.now },
      updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  ],

  // Delivery notes
  delivery_notes: { type: String, default: '' }

}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
