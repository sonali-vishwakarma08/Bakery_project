const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: null   // optional
  },

  image: {
    type: String,
    required: true
  },

  link: {
    type: String,
    trim: true,
    default: null   // optional
  },

  bannerType: {
    type: String,
    enum: ['slider', 'home', 'offer', 'custom'],
    default: 'slider'
  },

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },

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
