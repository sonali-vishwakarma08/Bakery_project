const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Public routes
router.post('/all', categoryController.getCategories);       // Get all categories
router.post('/single', categoryController.getCategoryById);  // Get single category

// Admin routes
router.post('/create', verifyToken, requireAdmin, categoryController.createCategory);
router.post('/update', verifyToken, requireAdmin, categoryController.updateCategory);
router.post('/delete', verifyToken, requireAdmin, categoryController.deleteCategory);

module.exports = router;
