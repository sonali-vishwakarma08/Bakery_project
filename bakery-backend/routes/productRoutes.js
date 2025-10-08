const express = require('express');
const router = express.Router();
const productController = require('../controllers/commonController/productController');
const authMiddleware = require('../middleware/auth');

// Get all products → Any authenticated user
router.get('/all', authMiddleware.verifyToken, productController.getProducts);

// Get single product by ID → Any authenticated user
router.get('/:id', authMiddleware.verifyToken, productController.getProductById);

// Create a new product → Admin only
router.post('/create', authMiddleware.verifyToken, authMiddleware.requireAdmin, productController.createProduct);

// Update product by ID → Admin only
router.put('/update/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, productController.updateProduct);

// Delete product by ID → Admin only
router.delete('/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, productController.deleteProduct);

module.exports = router;
