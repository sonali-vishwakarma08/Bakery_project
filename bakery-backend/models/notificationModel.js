const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  
  // For admin notifications that target multiple users
  target_role: { 
    type: String, 
    enum: ['customer', 'admin', 'delivery_staff', 'all'], 
    default: null 
  },

  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  
  // Rich content for detailed notifications
  content: { type: String },
  
  // Actionable notifications
  action_url: { type: String },
  action_text: { type: String },

  type: {
    type: String,
    enum: ["order", "system", "promo", "delivery", "payment"],
    default: "system"
  },
  
  // Priority levels
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },

  is_read: {
    type: Boolean,
    default: false
  },
  
  // Flag to indicate if this is a delivery copy (not shown in admin UI)
  is_delivery_copy: {
    type: Boolean,
    default: false
  },
  
  // For auto-expiring notifications
  expires_at: { type: Date, default: null }

}, { timestamps: true });

notificationSchema.index({ user: 1, is_read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
