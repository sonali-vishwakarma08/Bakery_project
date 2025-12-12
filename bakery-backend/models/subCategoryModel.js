const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: {
    type: String,
    trim: true,
    unique: false,
    sparse: true
  },
  

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  description: { type: String, default: '' },
  image: { type: String, default: '' },
  
  // Display settings
  display_order: { type: Number, default: 0 },
  is_featured: { type: Boolean, default: false },

  status: { type: String, enum: ['active', 'inactive'], default: 'active' }

}, { timestamps: true });

subCategorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/ /g, "-");
  }
  next();
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
