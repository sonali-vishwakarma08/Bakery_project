const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Get settings (admin only)
router.get('/get', verifyToken, requireAdmin, settingsController.getSettings);

// Update settings (admin only)
router.post('/update', verifyToken, requireAdmin, settingsController.updateSettings);

// Reset settings to default (admin only)
router.post('/reset', verifyToken, requireAdmin, settingsController.resetSettings);

module.exports = router;
