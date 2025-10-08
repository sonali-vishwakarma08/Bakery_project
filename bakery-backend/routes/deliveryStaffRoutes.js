const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryStaffController');
const authMiddleware = require('../middleware/auth');

// Create new delivery → Admin only
router.post('/create', authMiddleware.verifyToken, authMiddleware.requireAdmin, deliveryController.createDelivery);

// Get all deliveries → Any authenticated user
router.get('/all', authMiddleware.verifyToken, deliveryController.getDeliveries);

// Get single delivery by ID → Any authenticated user
router.get('/:id', authMiddleware.verifyToken, deliveryController.getDeliveryById);

// Update delivery → Admin only
router.put('/update/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, deliveryController.updateDelivery);

// Delete delivery → Admin only
router.delete('/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, deliveryController.deleteDelivery);

module.exports = router;
