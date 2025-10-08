const express = require('express');
const router = express.Router();
const couponController = require('../controllers/commonController/couponController');

// All routes are POST
router.post('/create', couponController.createCoupon);
router.post('/update/:id', couponController.updateCoupon);
router.post('/delete/:id', couponController.deleteCoupon);
router.post('/all', couponController.getCoupons);
router.post('/:id', couponController.getCouponById);

module.exports = router;
