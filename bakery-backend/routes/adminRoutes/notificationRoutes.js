const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/adminContoller/notificationController');
const authMiddleware = require('../../middleware/auth');

// Save FCM device token (user)
router.post('/device-token', authMiddleware.verifyToken, notificationController.saveDeviceToken);

// Remove FCM device token (user logout)
router.post('/remove-token', authMiddleware.verifyToken, notificationController.removeDeviceToken);

// Get user notifications
router.get('/', authMiddleware.verifyToken, notificationController.getUserNotifications);

// Send notification to user (admin only)
router.post('/send', authMiddleware.verifyToken, authMiddleware.requireAdmin, notificationController.sendNotificationToUser);

// Broadcast notification to all users (admin only)
router.post('/broadcast', authMiddleware.verifyToken, authMiddleware.requireAdmin, notificationController.broadcastNotification);

// Mark notification as read
router.put('/:notificationId', authMiddleware.verifyToken, notificationController.markAsRead);

// Admin routes
router.post('/all', authMiddleware.verifyToken, authMiddleware.requireAdmin, notificationController.getAllNotifications);
router.post('/get', authMiddleware.verifyToken, authMiddleware.requireAdmin, notificationController.getNotificationById);
router.post('/read', authMiddleware.verifyToken, authMiddleware.requireAdmin, notificationController.markNotificationAsRead);
router.post('/read-all', authMiddleware.verifyToken, authMiddleware.requireAdmin, notificationController.markAllNotificationsAsRead);
router.post('/delete', authMiddleware.verifyToken, authMiddleware.requireAdmin, notificationController.deleteNotification);
router.post('/delete-all-broadcasts', authMiddleware.verifyToken, authMiddleware.requireAdmin, notificationController.deleteAllBroadcastNotifications);
router.post('/unread-count', authMiddleware.verifyToken, authMiddleware.requireAdmin, notificationController.getUnreadCount);

module.exports = router;
