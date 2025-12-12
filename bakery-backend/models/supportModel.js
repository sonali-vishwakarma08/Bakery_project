const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: String, // For non-registered users
  email: String,
  phone: String,
  subject: { type: String, required: true },
  message: { type: String, required: true },
  
  // Ticket category
  category: {
    type: String,
    enum: ['order_issue', 'product_issue', 'payment_issue', 'delivery_issue', 'account_issue', 'other'],
    default: 'other'
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  status: { 
    type: String, 
    enum: ['open', 'in_progress', 'resolved', 'closed'], 
    default: 'open' 
  },
  
  // Assigned agent
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Response tracking
  response_count: { type: Number, default: 0 },
  last_response_at: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Support', supportSchema);
