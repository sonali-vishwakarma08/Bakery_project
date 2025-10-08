const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/auth');

// Add new inventory → Admin only
router.post('/add', authMiddleware.verifyToken, authMiddleware.requireAdmin, inventoryController.addInventory);

// Get all inventories → Any authenticated user
router.get('/all', authMiddleware.verifyToken, inventoryController.getInventories);

// Get single inventory by ID → Any authenticated user
router.get('/:id', authMiddleware.verifyToken, inventoryController.getInventoryById);

// Update inventory → Admin only
router.put('/update/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, inventoryController.updateInventory);

// Restock inventory → Admin only
router.put('/restock/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, inventoryController.restockInventory);

// Delete inventory → Admin only
router.delete('/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, inventoryController.deleteInventory);

module.exports = router;
