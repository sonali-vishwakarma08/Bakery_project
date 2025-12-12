const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  businessName: { type: String, default: 'The Velvet Delights' },
  businessEmail: { type: String, default: 'info@velvetdelights.com' },
  businessPhone: { type: String, default: '+91 1234567890' },
  businessAddress: { type: String, default: '123 Bakery Street, Mumbai, India' },
  businessLogo: { type: String, default: '' },

  taxRate: { type: Number, default: 18 },

  currency: { type: String, default: 'INR' },
  currencySymbol: { type: String, default: '₹' },

  // Order settings
  minOrderAmount: { type: Number, default: 100 },
  deliveryCharge: { type: Number, default: 50 },
  freeDeliveryAbove: { type: Number, default: 500 },
  
  // Delivery settings
  deliveryRadius: { type: Number, default: 10 }, // in kilometers
  preparationTimeBuffer: { type: Number, default: 30 }, // in minutes
  
  // Operational hours
  openingTime: { type: String, default: '08:00' },
  closingTime: { type: String, default: '22:00' },
  
  // Payment settings
  codEnabled: { type: Boolean, default: true },
  onlinePaymentEnabled: { type: Boolean, default: true },
  
  // Bakery-specific settings
  allowCustomCakes: { type: Boolean, default: true },
  customCakeNoticePeriod: { type: Number, default: 24 }, // in hours
  
  // Notification settings
  emailNotifications: { type: Boolean, default: true },
  orderNotifications: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: true },
  
  // Social media links
  socialMediaLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  
  // SEO settings
  metaDescription: { type: String, default: 'Freshly baked goods delivered to your doorstep' },
  metaKeywords: { type: String, default: 'bakery, cakes, pastries, bread, desserts' }

}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
