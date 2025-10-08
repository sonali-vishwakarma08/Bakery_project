// routes/index.js
const express = require('express');
const router = express.Router();

// Import all route modules
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const couponRoutes = require('./couponRoutes');
const deliveryRoutes = require('./deliveryStaffRoutes');
const notificationRoutes = require('./notificationRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const reviewRoutes = require('./reviewRoutes');
const paymentRoutes = require('./paymentRoutes');

// Mount all routes on appropriate paths
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/coupons', couponRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/notifications', notificationRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
