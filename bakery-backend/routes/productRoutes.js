const express = require('express');
const router = express.Router();
const productController = require('../controllers/commonController/productController');
const authMiddleware = require('../middleware/auth');

// ================== Public routes (no login required) ==================

// Get all products → anyone can view
router.post('/all', productController.getProducts);

// Get single product by ID → anyone can view (send { id: "<productId>" } in body)
router.post('/single', productController.getProductById);

// ================== Admin routes (login + admin role required) ==================

// Create a new product → Admin only
router.post('/create', authMiddleware.verifyToken, authMiddleware.requireAdmin, productController.createProduct);

// Update product by ID → Admin only (send { id, ...updates } in body)
router.post('/update', authMiddleware.verifyToken, authMiddleware.requireAdmin, productController.updateProduct);

// Delete product by ID → Admin only (send { id } in body)
router.post('/delete', authMiddleware.verifyToken, authMiddleware.requireAdmin, productController.deleteProduct);

module.exports = router;
