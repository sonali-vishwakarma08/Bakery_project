const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null // null means broadcast to all users
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  message: { 
    type: String, 
    required: true, 
    trim: true 
  },
  type: { 
    type: String, 
    enum: ['order', 'system', 'promo', 'alert'], 
    default: 'system' 
  },
  is_read: { 
    type: Boolean, 
    default: false 
  },
  sent_by: { 
    type: String, 
    enum: ['system', 'admin'], 
    default: 'system' 
  },
  is_deleted: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

// Indexes for faster queries
notificationSchema.index({ user: 1, is_read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ is_deleted: 1 });

module.exports = mongoose.model('Notification', notificationSchema);