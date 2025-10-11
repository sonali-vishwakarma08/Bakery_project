import { useState, useEffect } from "react";
import { FaBell, FaTrash, FaCheck, FaCheckDouble, FaFilter, FaBullhorn, FaTimes } from "react-icons/fa";
import { getAllNotifications, markAsRead, markAllAsRead, deleteNotification, createNotification } from "../api/notificationApi";
import { showSuccess, showError } from "../utils/toast";
import { useAuth } from "../context/AuthContext";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    type: "system",
    isBroadcast: true
  });
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const filters = filter === "unread" ? { is_read: false } : {};
      const data = await getAllNotifications(filters);
      setNotifications(data);
    } catch (err) {
      showError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      showSuccess("Marked as read");
      fetchNotifications();
    } catch (err) {
      showError("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(user?._id);
      showSuccess("All notifications marked as read");
      fetchNotifications();
    } catch (err) {
      showError("Failed to mark all as read");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      await deleteNotification(id);
      showSuccess("Notification deleted");
      fetchNotifications();
    } catch (err) {
      showError("Failed to delete notification");
    }
  };

  const handleBroadcastChange = (field, value) => {
    setBroadcastForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    
    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) {
      showError("Title and message are required");
      return;
    }

    try {
      setSending(true);
      await createNotification({
        user: broadcastForm.isBroadcast ? null : user._id, // null = broadcast to all
        title: broadcastForm.title,
        message: broadcastForm.message,
        type: broadcastForm.type,
        sent_by: "admin"
      });
      
      showSuccess(broadcastForm.isBroadcast ? "Broadcast sent to all users!" : "Notification created!");
      setShowBroadcastModal(false);
      setBroadcastForm({
        title: "",
        message: "",
        type: "system",
        isBroadcast: true
      });
      fetchNotifications();
    } catch (err) {
      showError("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-700";
      case "system":
        return "bg-gray-100 text-gray-700";
      case "promo":
        return "bg-green-100 text-green-700";
      case "alert":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaBell className="text-pink-500" />
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h2>
              <p className="text-gray-500 text-sm mt-1">Manage your notifications and alerts</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === "all"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === "unread"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Unread
                </button>
              </div>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
              >
                <FaBullhorn />
                Broadcast
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                >
                  <FaCheckDouble />
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading notifications...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No notifications found</p>
              <p className="text-gray-400 text-sm mt-2">
                {filter === "unread" ? "All caught up!" : "You don't have any notifications yet"}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-gray-50 transition ${
                  !notification.is_read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {notification.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      {!notification.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{formatTime(notification.createdAt)}</span>
                      {notification.sent_by && (
                        <span>From: {notification.sent_by}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Mark as read"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaBullhorn className="text-blue-500 text-2xl" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {broadcastForm.isBroadcast ? "Broadcast Notification" : "Create Notification"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {broadcastForm.isBroadcast 
                      ? "Send notification to all users" 
                      : "Send notification to yourself"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="p-6 space-y-4">
              {/* Broadcast Toggle */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Broadcast to All Users</p>
                  <p className="text-sm text-gray-600">
                    {broadcastForm.isBroadcast 
                      ? "This notification will be sent to all users" 
                      : "This notification will only be sent to you"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleBroadcastChange("isBroadcast", !broadcastForm.isBroadcast)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    broadcastForm.isBroadcast ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      broadcastForm.isBroadcast ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={broadcastForm.title}
                  onChange={(e) => handleBroadcastChange("title", e.target.value)}
                  placeholder="Enter notification title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={broadcastForm.message}
                  onChange={(e) => handleBroadcastChange("message", e.target.value)}
                  placeholder="Enter notification message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Type
                </label>
                <select
                  value={broadcastForm.type}
                  onChange={(e) => handleBroadcastChange("type", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="system">System</option>
                  <option value="order">Order</option>
                  <option value="promo">Promotion</option>
                  <option value="alert">Alert</option>
                </select>
              </div>

              {/* Preview */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-gray-800">
                      {broadcastForm.title || "Notification Title"}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(broadcastForm.type)}`}>
                      {broadcastForm.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {broadcastForm.message || "Notification message will appear here..."}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Just now • From: admin</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaBullhorn />
                      {broadcastForm.isBroadcast ? "Send Broadcast" : "Create Notification"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
