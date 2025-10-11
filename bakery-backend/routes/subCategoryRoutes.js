const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/all', subCategoryController.getSubCategories);
router.get('/single/:id', subCategoryController.getSubCategoryById);

// Admin routes
router.post('/create', verifyToken, requireAdmin, upload.single('image'), subCategoryController.createSubCategory);
router.post('/update', verifyToken, requireAdmin, upload.single('image'), subCategoryController.updateSubCategory);
router.post('/delete', verifyToken, requireAdmin, subCategoryController.deleteSubCategory);

module.exports = router;
