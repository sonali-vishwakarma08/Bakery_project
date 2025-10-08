const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryStaffController');
const authMiddleware = require('../middleware/auth');

// ================== Admin routes ==================

// Create new delivery → Admin only
router.post('/create', authMiddleware.verifyToken, authMiddleware.requireAdmin, deliveryController.createDelivery);

// Update delivery → Admin only
router.post('/update', authMiddleware.verifyToken, authMiddleware.requireAdmin, deliveryController.updateDelivery);

// Delete delivery → Admin only
router.post('/delete', authMiddleware.verifyToken, authMiddleware.requireAdmin, deliveryController.deleteDelivery);

// ================== Authenticated routes ==================

// Get all deliveries → Any authenticated user
router.post('/all', authMiddleware.verifyToken, deliveryController.getDeliveries);

// Get single delivery → Any authenticated user
router.post('/get', authMiddleware.verifyToken, deliveryController.getDeliveryById);

module.exports = router;
