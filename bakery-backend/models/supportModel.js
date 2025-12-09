const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  subject: String,
  message: String,
  email: String,
  status: { type: String, enum: ['open','in_progress','closed'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Support', supportSchema);
