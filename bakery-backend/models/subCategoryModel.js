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

  status: { type: String, enum: ['active', 'inactive'], default: 'active' }

}, { timestamps: true });

subCategorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/ /g, "-");
  }
  next();
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
