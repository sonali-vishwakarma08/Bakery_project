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
    const { user, type, is_read } = req.body; // optional filters
    const filter = { is_deleted: false }; // Don't show deleted notifications
    
    if (user) filter.user = user;
    if (type) filter.type = type;
    if (is_read !== undefined) filter.is_read = is_read;

    const notifications = await Notification.find(filter)
      .populate('user', 'name email')
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

// Mark all notifications as read for a user
exports.markAllAsRead = async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) return res.status(400).json({ message: 'User ID is required.' });

    await Notification.updateMany(
      { user, is_read: false, is_deleted: false },
      { is_read: true }
    );

    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get unread count for a user
exports.getUnreadCount = async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) return res.status(400).json({ message: 'User ID is required.' });

    const count = await Notification.countDocuments({
      user,
      is_read: false,
      is_deleted: false
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Broadcast notification to all users
exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required.' });
    }

    const notification = new Notification({
      user: null, // null means broadcast
      title,
      message,
      type: type || 'system',
      sent_by: 'admin'
    });

    const savedNotification = await notification.save();
    res.status(201).json({
      message: 'Broadcast notification created successfully.',
      notification: savedNotification
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete all notifications for a user
exports.clearAllNotifications = async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) return res.status(400).json({ message: 'User ID is required.' });

    await Notification.updateMany(
      { user, is_deleted: false },
      { is_deleted: true }
    );

    res.json({ message: 'All notifications cleared successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
