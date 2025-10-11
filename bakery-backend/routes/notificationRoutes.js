const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

// ================== Authenticated routes ==================

// Create a new notification → Admin only
router.post('/create', authMiddleware.verifyToken, authMiddleware.requireAdmin, notificationController.createNotification);

// Get all notifications → Any authenticated user
router.post('/all', authMiddleware.verifyToken, notificationController.getNotifications);

// Get single notification → Any authenticated user
router.post('/get', authMiddleware.verifyToken, notificationController.getNotificationById);

// Mark as read → Any authenticated user
router.post('/read', authMiddleware.verifyToken, notificationController.markAsRead);

// Delete notification → Admin only
router.post('/delete', authMiddleware.verifyToken, authMiddleware.requireAdmin, notificationController.deleteNotification);

module.exports = router;
