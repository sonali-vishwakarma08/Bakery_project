// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentCtrl = require('../../controllers/adminContoller/paymentController');
const authMiddleware = require('../../middleware/auth');

// Create PayPal order (authenticated users)
router.post('/create-order', authMiddleware.verifyToken, paymentCtrl.createOrder);

// Verify PayPal payment (authenticated users)
router.post('/verify', authMiddleware.verifyToken, paymentCtrl.verifyPayment);

// Webhook (no auth required - PayPal calls this)
router.post('/webhook', express.json(), paymentCtrl.webhook);

// Refund payment (admin only)
router.post('/refund', authMiddleware.verifyToken, authMiddleware.requireAdmin, paymentCtrl.refundPayment);

// Cancel payment (admin only)
router.post('/cancel', authMiddleware.verifyToken, authMiddleware.requireAdmin, paymentCtrl.cancelPayment);

// Retry failed payment (admin or user)
router.post('/retry', authMiddleware.verifyToken, paymentCtrl.retryPayment);

// Get payment details (authenticated)
router.get('/details/:id', authMiddleware.verifyToken, paymentCtrl.getPaymentDetails);
router.post('/details', authMiddleware.verifyToken, paymentCtrl.getPaymentDetails);

// Get all payments (admin only)
router.get('/', authMiddleware.verifyToken, authMiddleware.requireAdmin, paymentCtrl.getPayments);
router.post('/all', authMiddleware.verifyToken, authMiddleware.requireAdmin, paymentCtrl.getPayments);

// Get user's payments (authenticated users)
router.get('/my', authMiddleware.verifyToken, paymentCtrl.getMyPayments);

// Get payment statistics (admin only)
router.get('/stats', authMiddleware.verifyToken, authMiddleware.requireAdmin, paymentCtrl.getPaymentStats);

module.exports = router;