const Wishlist = require('../models/wishlistModel.js');

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { user, product } = req.body;
    if (!user || !product) return res.status(400).json({ message: 'User and product are required' });

    // Check if already exists
    const exists = await Wishlist.findOne({ user, product });
    if (exists) return res.status(400).json({ message: 'Product already in wishlist' });

    const wishlistItem = new Wishlist({ user, product });
    const savedItem = await wishlistItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get wishlist for a user
exports.getUserWishlist = async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) return res.status(400).json({ message: 'User ID is required' });

    const wishlist = await Wishlist.find({ user })
      .populate('product', 'name price images')
      .sort({ added_at: -1 });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { user, product } = req.body;
    if (!user || !product) return res.status(400).json({ message: 'User and product are required' });

    const deleted = await Wishlist.findOneAndDelete({ user, product });
    if (!deleted) return res.status(404).json({ message: 'Wishlist item not found' });

    res.json({ message: 'Product removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
