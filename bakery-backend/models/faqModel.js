const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({

  category: {
    type: String,
    enum: ['general', 'orders', 'payments', 'delivery', 'custom_cake', 'account', 'other'],
    default: 'general'
  },

  question: {
    type: String,
    required: true,
    trim: true
  },

  answer: {
    type: String,
    required: true,
    trim: true
  },

  // For ordering FAQs in UI
  sort_order: {
    type: Number,
    default: 0
  },

  // Hide/Show FAQ
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },

  // Highlight important questions
  is_featured: {
    type: Boolean,
    default: false
  },

  // Optional admin reference
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }

}, {
  timestamps: true
});

// Index for category + sort order
faqSchema.index({ category: 1, sort_order: 1 });

module.exports = mongoose.model('FAQ', faqSchema);
