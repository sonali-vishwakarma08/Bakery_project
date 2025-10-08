const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/create', orderController.createOrder);

// Get all orders (POST version)
router.post('/all', orderController.getOrders);

// Get single order by ID (POST version)
router.post('/get', orderController.getOrderById);

// Update order status (POST version)
router.post('/update-status', orderController.updateOrderStatus);

// Delete order (POST version)
router.post('/delete', orderController.deleteOrder);

module.exports = router;
