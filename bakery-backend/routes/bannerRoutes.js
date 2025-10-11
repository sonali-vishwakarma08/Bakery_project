const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/all', bannerController.getBanners);
router.get('/single/:id', bannerController.getBannerById);

// Admin routes
router.post('/create', verifyToken, requireAdmin, upload.single('image'), bannerController.createBanner);
router.post('/update', verifyToken, requireAdmin, upload.single('image'), bannerController.updateBanner);
router.post('/delete', verifyToken, requireAdmin, bannerController.deleteBanner);

module.exports = router;
