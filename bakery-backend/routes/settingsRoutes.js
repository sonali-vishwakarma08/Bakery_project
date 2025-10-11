const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middleware/auth');

router.get('/get', authMiddleware.verifyToken, authMiddleware.requireAdmin, settingsController.getSettings);
router.post('/update', authMiddleware.verifyToken, authMiddleware.requireAdmin, settingsController.updateSettings);
router.post('/reset', authMiddleware.verifyToken, authMiddleware.requireAdmin, settingsController.resetSettings);

module.exports = router;
