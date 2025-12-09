const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/adminContoller/notificationController');
const authMiddleware = require('../../middleware/auth');

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

// Mark all as read → Any authenticated user
router.post('/read-all', authMiddleware.verifyToken, notificationController.markAllAsRead);

// Get unread count → Any authenticated user
router.post('/unread-count', authMiddleware.verifyToken, notificationController.getUnreadCount);

module.exports = router;
