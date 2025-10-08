const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: {
  type: Number,
  required: true
},
  passwordHash: {
    type: String,
    required: function () { return this.auth_provider === 'local'; }
  },
  auth_provider: { type: String, enum: ['local', 'google', 'apple'], default: 'local' },
  google_id: { type: String, default: null },
  apple_id: { type: String, default: null },
  profile_image: { type: String, default: null },
  role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otp_expiry: { type: Date, default: null },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  }
}, { timestamps: true });



module.exports = mongoose.model('User', userSchema);
