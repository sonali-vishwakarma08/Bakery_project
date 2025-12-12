const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: null   // optional
  },

  subtitle: {
    type: String,
    trim: true,
    default: null
  },

  image: {
    type: String,
    required: true
  },

  mobileImage: {
    type: String   // Different image for mobile devices
  },

  link: {
    type: String,
    trim: true,
    default: null   // optional
  },

  // Target specific user segments
  targetAudience: {
    type: String,
    enum: ['all', 'new_users', 'existing_users', 'vip'],
    default: 'all'
  },

  bannerType: {
    type: String,
    enum: ['slider', 'home', 'offer', 'custom'],
    default: 'slider'
  },

  // For promotional banners
  promotionText: { type: String },
  promotionBadge: { type: String },

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },

  // Schedule banner to show between dates
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },

  displayOrder: {
    type: Number,
    default: 0,
    index: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
