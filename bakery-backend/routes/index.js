const express = require('express');
const router = express.Router();

// Import all route modules
const productRoutes = require('./adminRoutes/productRoutes');
const categoryRoutes = require('./adminRoutes/categoryRoutes');
const subCategoryRoutes = require('./adminRoutes/subCategoryRoutes');
const bannerRoutes = require('./adminRoutes/bannerRoutes');
const orderRoutes = require('./adminRoutes/orderRoutes');
const couponRoutes = require('./adminRoutes/couponRoutes');
const deliveryRoutes = require('./adminRoutes/deliveryStaffRoutes');
const notificationRoutes = require('./adminRoutes/notificationRoutes');
const wishlistRoutes = require('./userRoutes/wishlistRoutes');
const inventoryRoutes = require('./adminRoutes/inventoryRoutes');
const reviewRoutes = require('./adminRoutes/reviewRoutes');
const paymentRoutes = require('./adminRoutes/paymentRoutes');
const userAuthRoutes = require('./userRoutes/userAuthRoutes');
const userRoutes=require('./userRoutes/index');
const dashboardRoutes = require('./adminRoutes/dashboardRoutes');
const settingsRoutes = require('./adminRoutes/settingsRoutes');
const cartRoutes = require('./adminRoutes/cartRoutes');
const faqRoutes = require('./adminRoutes/faqRoutes');
const supportRoutes = require('./adminRoutes/supportRoutes');
const adminLogRoutes = require('./adminRoutes/adminLogRoutes');

// Mount all routes on appropriate paths
router.use('/UserAuth', userAuthRoutes); 
router.use('/user', userAuthRoutes);
router.use('/auth', userAuthRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/subcategories', subCategoryRoutes);
router.use('/banners', bannerRoutes);
router.use('/orders', orderRoutes);
router.use('/coupons', couponRoutes);
router.use('/payment', paymentRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/notifications', notificationRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/settings', settingsRoutes);
router.use('/cart', cartRoutes);
router.use('/faq', faqRoutes);
router.use('/support', supportRoutes);
router.use('/admin-logs', adminLogRoutes);

module.exports = router;
