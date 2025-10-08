const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController.js');

// All routes using POST for simplicity
router.post('/add', inventoryController.addInventory);
router.post('/all', inventoryController.getInventories);
router.post('/get', inventoryController.getInventoryById);
router.post('/update', inventoryController.updateInventory);
router.post('/restock', inventoryController.restockInventory);
router.post('/delete', inventoryController.deleteInventory);

module.exports = router;
