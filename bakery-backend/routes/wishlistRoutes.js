const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/auth');

// Add product to wishlist → Any authenticated user (customer)
router.post('/add', authMiddleware.verifyToken, authMiddleware.requireCustomer, wishlistController.addToWishlist);

// Get user's wishlist → Any authenticated user (customer)
router.get('/all', authMiddleware.verifyToken, authMiddleware.requireCustomer, wishlistController.getUserWishlist);

// Remove product from wishlist → Any authenticated user (customer)
router.delete('/remove/:productId', authMiddleware.verifyToken, authMiddleware.requireCustomer, wishlistController.removeFromWishlist);

module.exports = router;
