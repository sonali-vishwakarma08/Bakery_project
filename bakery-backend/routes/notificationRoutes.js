const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/commonController/notificationController');

// All POST routes
router.post('/create', notificationController.createNotification);
router.post('/all', notificationController.getNotifications);
router.post('/get', notificationController.getNotificationById);
router.post('/read', notificationController.markAsRead);
router.post('/delete', notificationController.deleteNotification);

module.exports = router;
