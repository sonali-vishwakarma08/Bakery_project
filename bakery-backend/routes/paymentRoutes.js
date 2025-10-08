const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

// ================== Authenticated routes ==================

// Create a new payment → Customer only
router.post('/create', authMiddleware.verifyToken, authMiddleware.requireCustomer, paymentController.createPayment);

// Get all payments → Admin only
router.post('/all', authMiddleware.verifyToken, authMiddleware.requireAdmin, paymentController.getPayments);

// Get single payment by ID → Admin or customer who made it
router.post('/get', authMiddleware.verifyToken, paymentController.getPaymentById);

// Update payment → Admin only
router.post('/update', authMiddleware.verifyToken, authMiddleware.requireAdmin, paymentController.updatePayment);

// Delete payment → Admin only
router.post('/delete', authMiddleware.verifyToken, authMiddleware.requireAdmin, paymentController.deletePayment);

module.exports = router;
