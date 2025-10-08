const express = require('express');
const router = express.Router();
const productController = require('../controllers/commonController/productController');

// All operations via POST

// Get all products (send optional filters in body)
router.post('/all', productController.getProducts);

// Get single product by ID (send { id: "<productId>" } in body)
router.post('/single', productController.getProductById);

// Create a new product
router.post('/create', productController.createProduct);

// Update product by ID (send { id: "<productId>", ...updateFields })
router.post('/update', productController.updateProduct);

// Delete product by ID (send { id: "<productId>" })
router.post('/delete', productController.deleteProduct);

module.exports = router;
