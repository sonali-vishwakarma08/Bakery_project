const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middleware/auth');

// ================== Admin routes ==================

// Create a coupon
router.post('/create', authMiddleware.verifyToken, authMiddleware.requireAdmin, couponController.createCoupon);

// Update a coupon
router.post('/update', authMiddleware.verifyToken, authMiddleware.requireAdmin, couponController.updateCoupon);

// Delete a coupon
router.post('/delete', authMiddleware.verifyToken, authMiddleware.requireAdmin, couponController.deleteCoupon);

// ================== Authenticated routes ==================

// Get all coupons
router.post('/all', authMiddleware.verifyToken, couponController.getCoupons);

// Get single coupon
router.post('/get', authMiddleware.verifyToken, couponController.getCouponById);

module.exports = router;
