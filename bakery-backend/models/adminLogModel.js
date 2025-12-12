const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  
  // Affected entity
  entity_type: { type: String }, // e.g., 'Product', 'Order', 'User'
  entity_id: { type: mongoose.Schema.Types.ObjectId },
  
  details: { type: mongoose.Schema.Types.Mixed },
  ip: String,
  
  // User agent for additional context
  user_agent: String,
  
  // Success or failure
  status: { type: String, enum: ['success', 'failure'], default: 'success' }
}, { timestamps: true });

module.exports = mongoose.model("AdminLog", adminLogSchema);
