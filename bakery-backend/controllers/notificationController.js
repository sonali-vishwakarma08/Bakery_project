const Notification = require('../models/notificationModel.js');

// Create new notification
exports.createNotification = async (req, res) => {
  try {
    const { user, title, message, type, sent_by } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required.' });
    }

    const notification = new Notification({ user, title, message, type, sent_by });
    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get notifications (all or by user)
exports.getNotifications = async (req, res) => {
  try {
    const { user } = req.body; // optional
    const filter = {};
    if (user) filter.user = user;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Notification ID is required.' });

    const notification = await Notification.findById(id).lean();
    if (!notification) return res.status(404).json({ message: 'Notification not found.' });

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Notification ID is required.' });

    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ message: 'Notification not found.' });

    notification.is_read = true;
    const updated = await notification.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Soft delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Notification ID is required.' });

    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ message: 'Notification not found.' });

    notification.is_deleted = true;
    const updated = await notification.save();
    res.json({ message: 'Notification deleted successfully.', notification: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
