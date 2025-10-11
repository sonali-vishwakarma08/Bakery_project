const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  provider: { 
    type: String, 
    required: true, 
    trim: true 
  }, // e.g., "Dunzo", "ShipRocket"
  tracking_id: { 
    type: String, 
    trim: true, 
    default: null, 
    index: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'picked', 'in_transit', 'delivered', 'failed'], 
    default: 'pending', 
    index: true 
  },
  expected_delivery_time: { 
    type: Date, 
    default: null 
  },
  delivery_fee: { 
    type: Number, 
    default: 0 
  },
  status_history: [{
    status: {
      type: String,
      enum: ['pending', 'picked', 'in_transit', 'delivered', 'failed']
    },
    updated_at: { 
      type: Date, 
      default: Date.now 
    }
  }],
  last_webhook_received: { 
    type: Date, 
    default: null 
  },
  webhook_payload: { 
    type: mongoose.Schema.Types.Mixed, 
    default: null 
  },
  notes: { 
    type: String, 
    trim: true, 
    default: null 
  },
  failure_reason: { 
    type: String, 
    trim: true, 
    default: null 
  }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryStaff', deliverySchema);