const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// ================== Protected routes (login required) ==================

// Create a new order → Any authenticated user with role 'customer'
router.post('/create', authMiddleware.verifyToken, authMiddleware.requireCustomer, orderController.createOrder);

// Get all orders → Admin only
router.post('/all', authMiddleware.verifyToken, authMiddleware.requireAdmin, orderController.getOrders);

// Get single order by ID → Admin or the customer who placed it (send { id } in body)
router.post('/get', authMiddleware.verifyToken, orderController.getOrderById);

// Update order status → Admin only (send { id, status } in body)
router.post('/update-status', authMiddleware.verifyToken, authMiddleware.requireAdmin, orderController.updateOrderStatus);

// Delete order → Admin only (send { id } in body)
router.post('/delete', authMiddleware.verifyToken, authMiddleware.requireAdmin, orderController.deleteOrder);

module.exports = router;
