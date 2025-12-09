const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/adminContoller/categoryController');
const { verifyToken, requireAdmin } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

// 🟢 Public routes
router.get('/all', categoryController.getCategories);
router.get('/single/:id', categoryController.getCategoryById);

// 🔒 Admin routes
router.post('/create', verifyToken, requireAdmin, upload.single('image'), categoryController.createCategory);
router.post('/update', verifyToken, requireAdmin, upload.single('image'), categoryController.updateCategory);
router.post('/delete', verifyToken, requireAdmin, categoryController.deleteCategory);

module.exports = router;
