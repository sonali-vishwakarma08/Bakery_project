const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController.js');

// Add product to wishlist
router.post('/add', wishlistController.addToWishlist);

// Get user's wishlist
router.post('/get', wishlistController.getUserWishlist);

// Remove product from wishlist
router.post('/remove', wishlistController.removeFromWishlist);

module.exports = router;
