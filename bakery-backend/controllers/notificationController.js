const Notification = require('../models/notificationModel.js');

// Helper function to create notification (can be used by other controllers)
exports.createNotificationHelper = async (userId, title, message, type = 'system') => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      sent_by: 'system'
    });
    await notification.save();
    return notification;
  } catch (err) {
    console.error('Error creating notification:', err);
    return null;
  }
};

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
    const { user, is_read, type } = req.body; // optional filters
    const filter = { is_deleted: false }; // Always exclude deleted notifications
    
    // Filter by user (or get all if admin and no user specified)
    if (user) {
      filter.user = user;
    } else if (req.user?.role === 'admin') {
      // Admin can see all notifications or broadcast notifications
      filter.$or = [{ user: null }, { user: req.user._id }];
    } else {
      // Regular users only see their own notifications
      filter.user = req.user._id;
    }
    
    // Filter by read status
    if (is_read !== undefined) {
      filter.is_read = is_read;
    }
    
    // Filter by type
    if (type) {
      filter.type = type;
    }

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
