const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// All routes use POST

// Create new delivery
router.post('/create', deliveryController.createDelivery);

// Get all deliveries
router.post('/all', deliveryController.getDeliveries);

// Get single delivery by ID
router.post('/get', deliveryController.getDeliveryById);

// Update delivery
router.post('/update', deliveryController.updateDelivery);

// Delete delivery
router.post('/delete', deliveryController.deleteDelivery);

module.exports = router;
