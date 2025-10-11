const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  businessName: {
    type: String,
    default: 'The Velvet Delights'
  },
  businessEmail: {
    type: String,
    default: 'info@velvetdelights.com'
  },
  businessPhone: {
    type: String,
    default: '+91 1234567890'
  },
  businessAddress: {
    type: String,
    default: '123 Bakery Street, Mumbai, India'
  },
  taxRate: {
    type: Number,
    default: 18
  },
  currency: {
    type: String,
    default: 'INR'
  },
  currencySymbol: {
    type: String,
    default: '₹'
  },
  minOrderAmount: {
    type: Number,
    default: 100
  },
  deliveryCharge: {
    type: Number,
    default: 50
  },
  freeDeliveryAbove: {
    type: Number,
    default: 500
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  orderNotifications: {
    type: Boolean,
    default: true
  },
  lowStockAlerts: {
    type: Boolean,
    default: true
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  codEnabled: {
    type: Boolean,
    default: true
  },
  onlinePaymentEnabled: {
    type: Boolean,
    default: true
  },
  socialMedia: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    whatsapp: { type: String, default: '' }
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    default: 'We are currently under maintenance. Please check back soon.'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
