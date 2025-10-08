const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/commonController/categoryController');

// All POST routes
router.post('/all', categoryController.getCategories);       // Get all categories
router.post('/single', categoryController.getCategoryById);  // Get single category
router.post('/create', categoryController.createCategory);   // Create category
router.post('/update', categoryController.updateCategory);   // Update category
router.post('/delete', categoryController.deleteCategory);   // Delete category

module.exports = router;
