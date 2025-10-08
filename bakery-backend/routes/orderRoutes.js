const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// Create a new order → Any authenticated user (customer)
router.post('/create', authMiddleware.verifyToken, authMiddleware.requireCustomer, orderController.createOrder);

// Get all orders → Admin only
router.get('/all', authMiddleware.verifyToken, authMiddleware.requireAdmin, orderController.getOrders);

// Get single order by ID → Admin or the customer who placed it
router.get('/:id', authMiddleware.verifyToken, orderController.getOrderById);

// Update order status → Admin only
router.put('/update-status/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, orderController.updateOrderStatus);

// Delete order → Admin only
router.delete('/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, orderController.deleteOrder);

module.exports = router;
