const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// ================== Public routes (no login required) ==================

// Get all categories (anyone can view)
router.post('/all', categoryController.getCategories);

// Get single category by ID (anyone can view)
router.post('/single', categoryController.getCategoryById);

// ================== Admin routes (login + admin role required) ==================

// Create new category
router.post('/create', verifyToken, requireAdmin, categoryController.createCategory);

// Update category
router.post('/update', verifyToken, requireAdmin, categoryController.updateCategory);

// Delete category
router.post('/delete', verifyToken, requireAdmin, categoryController.deleteCategory);

module.exports = router;
