// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentCtrl = require('../../controllers/adminContoller/paymentController');
const authMiddleware = require('../../middleware/auth');

// Create Razorpay order (authenticated users)
router.post('/create-order', authMiddleware.verifyToken, paymentCtrl.createOrder);

// Verify payment (authenticated users)
router.post('/verify', authMiddleware.verifyToken, paymentCtrl.verifyPayment);

// Webhook (no auth required - Razorpay calls this)
router.post('/webhook', express.json({ verify: (req, res, buf) => { req.rawBody = buf.toString('utf8'); } }), paymentCtrl.webhook);

module.exports = router;
