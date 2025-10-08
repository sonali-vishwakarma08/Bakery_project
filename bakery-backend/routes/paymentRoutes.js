const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

// Create a new payment → Any authenticated user (customer)
router.post('/create', authMiddleware.verifyToken, authMiddleware.requireCustomer, paymentController.createPayment);

// Get all payments → Admin only
router.get('/all', authMiddleware.verifyToken, authMiddleware.requireAdmin, paymentController.getPayments);

// Get single payment by ID → Admin or the customer who made it
router.get('/:id', authMiddleware.verifyToken, paymentController.getPaymentById);

// Update payment → Admin only
router.put('/update/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, paymentController.updatePayment);

// Delete payment → Admin only
router.delete('/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, paymentController.deletePayment);

module.exports = router;
