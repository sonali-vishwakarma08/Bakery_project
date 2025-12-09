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
