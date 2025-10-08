const express = require('express');
const router = express.Router();
const cartController = require('../controllers/commonController/cartController');

// All routes use POST
router.post('/add', cartController.addToCart);
router.post('/get', cartController.getCart);
router.post('/remove', cartController.removeFromCart);
router.post('/clear', cartController.clearCart);

module.exports = router;
