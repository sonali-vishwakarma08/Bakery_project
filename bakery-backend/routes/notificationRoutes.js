const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

// Create a new notification → Admin only
router.post('/create', authMiddleware.verifyToken, authMiddleware.requireAdmin, notificationController.createNotification);

// Get all notifications → Any authenticated user
router.get('/all', authMiddleware.verifyToken, notificationController.getNotifications);

// Get a single notification by ID → Any authenticated user
router.get('/:id', authMiddleware.verifyToken, notificationController.getNotificationById);

// Mark notification as read → Any authenticated user
router.put('/read/:id', authMiddleware.verifyToken, notificationController.markAsRead);

// Delete notification → Admin only
router.delete('/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, notificationController.deleteNotification);

module.exports = router;
