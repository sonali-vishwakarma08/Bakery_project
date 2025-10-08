const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middleware/auth');

// Create a new coupon → Admin only
router.post(
  '/create',
  authMiddleware.verifyToken,
  authMiddleware.requireAdmin,
  couponController.createCoupon
);

// Update a coupon → Admin only
router.put(
  '/update/:id',
  authMiddleware.verifyToken,
  authMiddleware.requireAdmin,
  couponController.updateCoupon
);

// Delete a coupon → Admin only
router.delete(
  '/delete/:id',
  authMiddleware.verifyToken,
  authMiddleware.requireAdmin,
  couponController.deleteCoupon
);

// Get all coupons → Any authenticated user
router.get(
  '/all',
  authMiddleware.verifyToken,
  couponController.getCoupons
);

// Get a single coupon by ID → Any authenticated user
router.get(
  '/:id',
  authMiddleware.verifyToken,
  couponController.getCouponById
);

module.exports = router;
