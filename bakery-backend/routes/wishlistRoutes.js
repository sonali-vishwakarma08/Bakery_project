const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/auth');

// Add product to wishlist → Customer only
router.post('/add', authMiddleware.verifyToken, authMiddleware.requireCustomer, wishlistController.addToWishlist);

// Get user's wishlist → Customer only
router.post('/get', authMiddleware.verifyToken, authMiddleware.requireCustomer, wishlistController.getUserWishlist);

// Remove product from wishlist → Customer only
router.post('/remove', authMiddleware.verifyToken, authMiddleware.requireCustomer, wishlistController.removeFromWishlist);

module.exports = router;
