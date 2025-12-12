const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,      // ⭐ Recommended
    index: true
  },

  slug: {
    type: String,
    trim: true,
    sparse: true
  },
  

  description: {
    type: String,
    default: ''
  },

  image: {
    type: String,
    default: ''
  },
  
  // For bakery-specific categorization
  category_type: {
    type: String,
    enum: ['regular', 'seasonal', 'festival', 'dietary'],
    default: 'regular'
  },

  // Display settings
  display_order: { type: Number, default: 0 },
  is_featured: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    index: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null    // safer if not used
  }

}, { timestamps: true });

// Auto-generate slug
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
