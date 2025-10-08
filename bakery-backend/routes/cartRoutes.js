const express = require('express');
const router = express.Router();
const cartController = require('../controllers/commonController/cartController');
const { verifyToken, requireAdmin, requireCustomer } = require('../middleware/auth');

// All routes use POST
router.post('/add', verifyToken, requireCustomer, cartController.addToCart);
router.post('/get', verifyToken, requireCustomer, cartController.getCart);
router.post('/remove', verifyToken, requireCustomer, cartController.removeFromCart);
router.post('/clear', verifyToken, requireCustomer, cartController.clearCart);

module.exports = router;
