const admin = require("firebase-admin");
const User = require("../../models/userModel");
const Notification = require("../../models/notificationModel");
const sendEmail = require("../../utils/email"); // Import email utility

// Store FCM token for user
const saveDeviceToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user._id;

    if (!fcmToken) {
      return res.status(400).json({ message: 'FCM token is required' });
    }

    // Update user with FCM token
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { fcmTokens: fcmToken } }, // Add token if not already present
      { new: true }
    );

    res.json({ success: true, message: 'Device token saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Remove FCM token (for logout)
const removeDeviceToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user._id;

    if (!fcmToken) {
      return res.status(400).json({ message: 'FCM token is required' });
    }

    // Remove token from user
    await User.findByIdAndUpdate(
      userId,
      { $pull: { fcmTokens: fcmToken } },
      { new: true }
    );

    res.json({ success: true, message: 'Device token removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Send notification to user (admin use)
const sendNotificationToUser = async (req, res) => {
  try {
    const { userId, title, body, data, sendEmail: shouldSendEmail = false } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has FCM tokens for background notifications
    const hasFCMTokens = user.fcmTokens && user.fcmTokens.length > 0;

    // Store notification in database
    const notification = await Notification.create({
      user: userId,
      title,
      message: body,
      content: data?.content || null,
      type: data?.type || 'system',
      priority: data?.priority || 'medium',
      is_read: false
    });

    console.log('Notification stored in database:', notification._id);
    console.log('Notification to send:', { userId, title, body });

    // Send email notification if requested
    let emailSent = false;
    if (shouldSendEmail && user.email) {
      try {
        await sendEmail.sendNotificationEmail(user, {
          title,
          message: body
        });
        emailSent = true;
        console.log('Email notification sent to:', user.email);
      } catch (emailError) {
        console.error('Failed to send email notification to:', user.email, emailError.message);
      }
    }

    // If user has FCM tokens, send via Firebase Admin SDK
    if (hasFCMTokens) {
      try {
        const message = {
          notification: {
            title: title,
            body: body
          },
          data: data || {},
          webpush: {
            notification: {
              title: title,
              body: body,
              icon: '/bakery-icon.png'
            }
          }
        };

        // Send to all user tokens
        const sendPromises = user.fcmTokens.map(token => 
          admin.messaging().sendToDevice(token, message).catch(err => {
            console.error(`Failed to send to token ${token}:`, err.message);
            return null;
          })
        );

        const results = await Promise.all(sendPromises);
        const successCount = results.filter(r => r && r.successCount > 0).length;
        console.log(`Successfully sent FCM notification to ${successCount}/${user.fcmTokens.length} devices`);
      } catch (fcmError) {
        console.error('FCM Error:', fcmError.message);
      }
    } else {
      // No FCM tokens - user will receive via polling when app is open
      console.log('User has no FCM tokens - notification stored for polling (app must be open)');
    }

    res.json({ 
      success: true, 
      message: 'Notification sent successfully',
      notificationId: notification._id,
      tokensCount: user.fcmTokens ? user.fcmTokens.length : 0,
      notificationType: hasFCMTokens ? 'fcm_push' : 'polling',
      emailSent: emailSent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Broadcast notification to all users (admin use)
const broadcastNotification = async (req, res) => {
  try {
    const { title, body, data, sendEmail: shouldSendEmail = false } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    // Get all users
    const users = await User.find({ role: 'customer' });
    
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Create a single broadcast notification entry
    const broadcastNotification = await Notification.create({
      user: null, // No specific user
      target_role: 'customer', // Target role for broadcast
      title,
      message: body,
      content: data?.content || null,
      type: data?.type || 'system',
      priority: data?.priority || 'medium',
      is_read: false
    });
    
    // Store individual notifications for each user (for delivery)
    const notifications = [];
    const successfulSends = [];
    let emailSuccessCount = 0;
    
    for (const user of users) {
      try {
        // Store notification in database for delivery purposes
        const notification = await Notification.create({
          user: user._id,
          target_role: 'customer', // Set target role for broadcast notifications
          title,
          message: body,
          content: data?.content || null,
          type: data?.type || 'system',
          priority: data?.priority || 'medium',
          is_read: false,
          is_delivery_copy: true // Mark as delivery copy to distinguish from broadcast entry
        });
        
        notifications.push(notification);
        
        // Send email notification if requested
        if (shouldSendEmail && user.email) {
          try {
            await sendEmail.sendNotificationEmail(user, {
              title,
              message: body
            });
            emailSuccessCount++;
            console.log('Email notification sent to:', user.email);
          } catch (emailError) {
            console.error('Failed to send email notification to:', user.email, emailError.message);
          }
        }
        
        // Check if user has FCM tokens for background notifications
        const hasFCMTokens = user.fcmTokens && user.fcmTokens.length > 0;
        
        if (hasFCMTokens) {
          try {
            const message = {
              notification: {
                title: title,
                body: body
              },
              data: data || {},
              webpush: {
                notification: {
                  title: title,
                  body: body,
                  icon: '/bakery-icon.png'
                }
              }
            };

            // Send to all user tokens
            const sendPromises = user.fcmTokens.map(token => 
              admin.messaging().sendToDevice(token, message).catch(err => {
                console.error(`Failed to send to token ${token}:`, err.message);
                return null;
              })
            );

            const results = await Promise.all(sendPromises);
            const successCount = results.filter(r => r && r.successCount > 0).length;
            
            if (successCount > 0) {
              successfulSends.push({
                userId: user._id,
                successCount,
                totalTokens: user.fcmTokens.length
              });
            }
            
            console.log(`Successfully sent FCM notification to ${successCount}/${user.fcmTokens.length} devices for user ${user._id}`);
          } catch (fcmError) {
            console.error('FCM Error for user', user._id, ':', fcmError.message);
          }
        } else {
          // No FCM tokens - user will receive via polling when app is open
          console.log('User has no FCM tokens - notification stored for polling (app must be open)', user._id);
        }
      } catch (userError) {
        console.error('Error processing notification for user', user._id, ':', userError.message);
      }
    }

    res.json({ 
      success: true, 
      message: `Notification broadcast to ${notifications.length} users successfully`,
      notificationsSent: notifications.length,
      successfulPushSends: successfulSends.length,
      emailSuccessCount: emailSuccessCount,
      notifications: notifications.map(n => ({
        id: n._id,
        userId: n.user
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get user's notifications
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user's unread notifications from database
    const notifications = await Notification.find({
      user: userId,
      is_read: false
    }).sort({ createdAt: -1 }).limit(50);

    res.json({
      success: true,
      notifications: notifications.map(n => ({
        _id: n._id,
        title: n.title,
        message: n.message,
        body: n.message,
        type: n.type,
        priority: n.priority,
        is_read: n.is_read,
        createdAt: n.createdAt,
        sentAt: n.createdAt,
        data: n.content ? { content: n.content } : {}
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    // Find and update notification
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all notifications (admin only)
const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;
    const skip = (page - 1) * limit;
    
    // For admin, get all notifications with pagination
    // Exclude delivery copies to avoid duplication
    const notifications = await Notification.find({
        $or: [
          { is_delivery_copy: { $ne: true } }, // Not a delivery copy
          { is_delivery_copy: { $exists: false } } // Or field doesn't exist
        ]
      })
      .populate('user', 'name email')
      .select('+target_role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    // Get total count for pagination (exclude delivery copies)
    const total = await Notification.countDocuments({
      $or: [
        { is_delivery_copy: { $ne: true } }, // Not a delivery copy
        { is_delivery_copy: { $exists: false } } // Or field doesn't exist
      ]
    });
    
    res.json({
      success: true,
      notifications: notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Mark notification as read (by ID)
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ message: 'Notification ID is required' });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { user } = req.body;
    
    const filter = user ? { user } : {};
    
    const result = await Notification.updateMany(
      filter,
      { is_read: true }
    );

    res.json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ message: 'Notification ID is required' });
    }

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ message: 'Notification ID is required' });
    }

    const notification = await Notification.findById(id).populate('user', 'name email');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const { user } = req.body;
    
    if (!user) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const count = await Notification.countDocuments({
      user,
      is_read: false
    });

    res.json({
      success: true,
      count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Helper function to create notifications
const createNotificationHelper = async (userId, title, message, type = 'system') => {
  try {
    // Check if a similar notification already exists
    const existingNotification = await Notification.findOne({
      user: userId,
      title,
      message,
      is_read: false
    });
    
    // If similar notification exists, don't create a duplicate
    if (existingNotification) {
      console.log('Duplicate notification prevented:', existingNotification._id);
      return existingNotification;
    }
    
    // Store notification in database
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      priority: 'medium',
      is_read: false
    });

    console.log('Notification stored in database:', notification._id);

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found for notification');
      return;
    }

    // Check if user has FCM tokens for background notifications
    const hasFCMTokens = user.fcmTokens && user.fcmTokens.length > 0;

    // Send email notification if user has email
    if (user.email) {
      try {
        await sendEmail.sendNotificationEmail(user, {
          title,
          message
        });
        console.log('Email notification sent to:', user.email);
      } catch (emailError) {
        console.error('Failed to send email notification to:', user.email, emailError.message);
      }
    }

    // If user has FCM tokens, send via Firebase Admin SDK
    if (hasFCMTokens) {
      try {
        const messageData = {
          notification: {
            title: title,
            body: message
          },
          webpush: {
            notification: {
              title: title,
              body: message,
              icon: '/bakery-icon.png'
            }
          }
        };

        // Send to all user tokens
        const sendPromises = user.fcmTokens.map(token => 
          admin.messaging().sendToDevice(token, messageData).catch(err => {
            console.error(`Failed to send to token ${token}:`, err.message);
            return null;
          })
        );

        const results = await Promise.all(sendPromises);
        const successCount = results.filter(r => r && r.successCount > 0).length;
        console.log(`Successfully sent FCM notification to ${successCount}/${user.fcmTokens.length} devices`);
      } catch (fcmError) {
        console.error('FCM Error:', fcmError.message);
      }
    } else {
      // No FCM tokens - user will receive via polling when app is open
      console.log('User has no FCM tokens - notification stored for polling (app must be open)');
    }

    return notification;
  } catch (err) {
    console.error('Error in createNotificationHelper:', err.message);
  }
};

// Delete all broadcast notifications
const deleteAllBroadcastNotifications = async (req, res) => {
  try {
    // Delete all notifications that are broadcasts (have target_role set) but are not delivery copies
    const result = await Notification.deleteMany({
      target_role: { $ne: null },
      $or: [
        { is_delivery_copy: { $ne: true } }, // Not a delivery copy
        { is_delivery_copy: { $exists: false } } // Or field doesn't exist
      ]
    });
    
    res.json({ 
      success: true, 
      message: `Deleted ${result.deletedCount} broadcast notifications`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  saveDeviceToken,
  removeDeviceToken,
  sendNotificationToUser,
  broadcastNotification,
  getUserNotifications,
  getAllNotifications,
  getNotificationById,
  markAsRead,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllBroadcastNotifications,
  getUnreadCount,
  createNotificationHelper
};