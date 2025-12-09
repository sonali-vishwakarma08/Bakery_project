const Wishlist = require('../../models/wishlistModel');
const Product = require('../../models/productModel');

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const user = req.user._id;
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({ user, product });
    if (existingWishlist) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const wishlistItem = new Wishlist({ user, product });
    await wishlistItem.save();

    res.status(201).json({ message: 'Product added to wishlist', wishlistItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's wishlist
exports.getUserWishlist = async (req, res) => {
  try {
    const user = req.user._id;

    const wishlist = await Wishlist.find({ user })
      .populate('product')
      .sort({ added_at: -1 });

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = req.user._id;
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const deletedItem = await Wishlist.findOneAndDelete({ user, product });

    if (!deletedItem) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    res.json({ message: 'Product removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};







