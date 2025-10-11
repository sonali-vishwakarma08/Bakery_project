import { useState, useEffect } from "react";
import { 
  FaBell, FaCheck, FaTrash, FaCheckDouble, FaBroadcastTower,
  FaExclamationCircle, FaInfoCircle, FaGift, FaCog
} from "react-icons/fa";
import { 
  getAllNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  broadcastNotification,
  clearAllNotifications
} from "../api/notificationApi";
import { showSuccess, showError } from "../utils/toast";
import { useAuth } from "../context/AuthContext";
import AddEditModal from "../Modals/AddEditModal";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [typeFilter, setTypeFilter] = useState("all"); // all, order, system, promo, alert
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [filter, typeFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const filters = {};
      
      if (filter === "unread") filters.is_read = false;
      if (filter === "read") filters.is_read = true;
      if (typeFilter !== "all") filters.type = typeFilter;

      const data = await getAllNotifications(filters);
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      showError("Failed to fetch notifications");
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
      showError(err.message || "Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(user?._id);
      showSuccess("All notifications marked as read");
      fetchNotifications();
    } catch (err) {
      showError(err.message || "Failed to mark all as read");
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
      showError(err.message || "Failed to delete notification");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) {
      return;
    }

    try {
      await clearAllNotifications(user?._id);
      showSuccess("All notifications cleared");
      fetchNotifications();
    } catch (err) {
      showError(err.message || "Failed to clear notifications");
    }
  };

  const handleBroadcast = async (formData) => {
    try {
      await broadcastNotification(formData);
      showSuccess("Broadcast notification sent successfully!");
      setShowBroadcastModal(false);
      fetchNotifications();
    } catch (err) {
      showError(err.message || "Failed to send broadcast");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <FaBell className="text-blue-500" />;
      case "alert":
        return <FaExclamationCircle className="text-red-500" />;
      case "promo":
        return <FaGift className="text-green-500" />;
      case "system":
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    
    return notifDate.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaBell className="text-pink-500" />
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h2>
              <p className="text-gray-500 text-sm mt-1">Manage your notifications and alerts</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
              >
                <FaBroadcastTower />
                Broadcast
              </button>
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 disabled:opacity-50"
              >
                <FaCheckDouble />
                Mark All Read
              </button>
              <button
                onClick={handleClearAll}
                disabled={notifications.length === 0}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50"
              >
                <FaTrash />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === "all"
                    ? "bg-pink-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === "unread"
                    ? "bg-pink-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === "read"
                    ? "bg-pink-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Read
              </button>
            </div>

            <div className="border-l border-gray-300 pl-4 flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="order">Orders</option>
                <option value="system">System</option>
                <option value="promo">Promotions</option>
                <option value="alert">Alerts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No notifications found</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-gray-50 transition ${
                  !notification.is_read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {notification.title}
                          {!notification.is_read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-pink-500 rounded-full"></span>
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{formatDate(notification.createdAt)}</span>
                          <span className="px-2 py-1 bg-gray-200 rounded">
                            {notification.type}
                          </span>
                          {notification.user && (
                            <span>To: {notification.user.name || notification.user.email}</span>
                          )}
                          {!notification.user && (
                            <span className="text-blue-600 font-medium">Broadcast</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
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
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Broadcast Modal */}
      <AddEditModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        title="Broadcast Notification"
        fields={[
          { label: "Title", name: "title", type: "text", required: true },
          { label: "Message", name: "message", type: "textarea", required: true },
          {
            label: "Type",
            name: "type",
            type: "select",
            required: true,
            options: [
              { value: "system", label: "System" },
              { value: "order", label: "Order" },
              { value: "promo", label: "Promotion" },
              { value: "alert", label: "Alert" },
            ],
          },
        ]}
        onSave={handleBroadcast}
      />
    </div>
  );
}
