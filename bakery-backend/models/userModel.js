const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: { type: String, required: true, trim: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },

  passwordHash: { type: String, required: true },

  // Optional: Social login
  auth_provider: { type: String, enum: ['local', 'google'], default: 'local' },
  google_id: { type: String, default: null },

  profile_image: { type: String, default: null },

  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },

  // Primary Address (optional)
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: { type: String, default: 'India' },
    phone: String
  },

  // Allow multiple saved addresses
  savedAddresses: [
    {
      name: String, // Home/Work
      street: String,
      city: String,
      state: String,
      zip: String,
      phone: String,
      addressType: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
      isDefault: { type: Boolean, default: false }
    }
  ],

  // Verification OTP
  otp: { type: String, default: null },
  otp_expiry: { type: Date, default: null },

  accountStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },

  lastLogin: { type: Date, default: null }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
