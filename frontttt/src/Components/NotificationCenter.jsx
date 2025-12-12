import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, CheckCircle } from 'lucide-react';
import '../styles/NotificationCenter.css';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) return;

        const response = await fetch('http://localhost:5000/api/notifications/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.notifications) {
            setNotifications(data.notifications);
            // Count unread notifications
            const unread = data.notifications.filter(n => !n.is_read).length;
            setUnreadCount(unread);
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Fetch on component mount and every 10 seconds
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const clearNotification = async (notificationId) => {
    try {
      console.log("Clearing notification:", notificationId);
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        console.log("No auth token found");
        return;
      }

      // Mark as read on backend
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_read: true })
      });

      console.log("Clear notification response:", response);

      if (response.ok) {
        const data = await response.json();
        console.log("Clear notification success:", data);
        // Remove from local state
        setNotifications(notifications.filter(n => n._id !== notificationId));
        setUnreadCount(Math.max(0, unreadCount - 1));
      } else {
        console.error('Failed to clear notification:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error clearing notification:', error);
    }
  };

  const clearAll = async () => {
    try {
      console.log("Clearing all notifications");
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        console.log("No auth token found");
        return;
      }

      // Mark all as read
      const responses = await Promise.all(
        notifications.map(n => 
          fetch(`http://localhost:5000/api/notifications/${n._id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_read: true })
          })
        )
      );

      console.log("Clear all responses:", responses);

      // Check if all requests were successful
      const allSuccessful = responses.every(response => response.ok);
      
      if (allSuccessful) {
        console.log("All notifications cleared successfully");
        // Clear local state
        setNotifications([]);
        setUnreadCount(0);
      } else {
        console.error('Some notifications failed to clear');
        // Still clear local state to give user a clean UI
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      // Still clear local state to give user a clean UI
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  return (
    <div className="notification-center">
      {/* Notification Bell Icon */}
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="notification-dropdown">
          {/* Header */}
          <div className="notification-header">
            <h3>🔔 Notifications</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Notifications List */}
          <div className="notification-list">
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  >
                    <div className="notification-content">
                      <div className="notification-icon">
                        {notification.type === 'order' && '📦'}
                        {notification.type === 'payment' && '💳'}
                        {notification.type === 'delivery' && '🚚'}
                        {notification.type === 'promo' && '🎉'}
                        {notification.type === 'system' && '⚙️'}
                      </div>
                      <div className="notification-text">
                        <p className="notification-title">{notification.title}</p>
                        <p className="notification-body">{notification.message || notification.body}</p>
                        <p className="notification-time">
                          <Clock size={12} />
                          {formatTime(notification.createdAt || notification.sentAt)}
                        </p>
                      </div>
                    </div>
                    <button
                      className="close-notification"
                      onClick={() => clearNotification(notification._id)}
                      title="Dismiss"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                {/* Clear All Button */}
                {notifications.length > 0 && (
                  <button className="clear-all-btn" onClick={clearAll}>
                    Clear All Notifications
                  </button>
                )}
              </>
            ) : (
              <div className="empty-state">
                <CheckCircle size={48} />
                <p>No notifications</p>
                <p className="empty-subtitle">You're all caught up! 🎉</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="notification-backdrop"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
