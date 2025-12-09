const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },

  type: {
    type: String,
    enum: ["order", "system", "promo"],
    default: "system"
  },

  is_read: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

notificationSchema.index({ user: 1, is_read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
