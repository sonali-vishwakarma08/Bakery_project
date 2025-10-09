const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/auth');

// ===== Admin Routes =====
// Add new inventory
router.post('/add', authMiddleware.verifyToken, authMiddleware.requireAdmin, inventoryController.addInventory);

// Update inventory
router.post('/update', authMiddleware.verifyToken, authMiddleware.requireAdmin, inventoryController.updateInventory);

// Restock inventory
router.post('/restock', authMiddleware.verifyToken, authMiddleware.requireAdmin, inventoryController.restockInventory);

// Delete inventory
router.post('/delete', authMiddleware.verifyToken, authMiddleware.requireAdmin, inventoryController.deleteInventory);

// ===== Authenticated User Routes =====
// Get all inventories
router.post('/all', authMiddleware.verifyToken, inventoryController.getInventories);

// Get single inventory by ID
router.post('/single', authMiddleware.verifyToken, inventoryController.getInventoryById);

module.exports = router;
