import { useState, useEffect } from "react";
import { FaBell, FaTrash, FaCheck, FaCheckDouble, FaFilter, FaBullhorn, FaTimes } from "react-icons/fa";
import { getAllNotifications, markAsRead, markAllAsRead, deleteNotification, createNotification } from "../api/notificationApi";
import { getAllUsers } from "../api/userApi";
import { showSuccess, showError } from "../utils/toast";
import { useAuth } from "../context/AuthContext";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showUserSelectModal, setShowUserSelectModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const { user } = useAuth();
  
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    type: "system",
    isBroadcast: true
  });

  const notificationTemplates = [
    {
      title: "Order Placed Successfully",
      message: "Thank you for your order! We're preparing your delicious baked goods and will notify you when it's ready.",
      type: "order"
    },
    {
      title: "Order Ready for Pickup",
      message: "Your order is ready for pickup! Please visit our bakery within the next 2 hours.",
      type: "order"
    },
    {
      title: "Package Delivered",
      message: "Your package has been successfully delivered. Enjoy your fresh baked goods!",
      type: "delivery"
    },
    {
      title: "Payment Received",
      message: "We've received your payment. Thank you for choosing our bakery!",
      type: "payment"
    },
    {
      title: "Special Promotion",
      message: "Exciting news! Check out our latest promotions and exclusive offers just for you.",
      type: "promo"
    },
    {
      title: "New Product Launch",
      message: "We've launched exciting new products! Come taste our latest creations.",
      type: "promo"
    },
    {
      title: "Store Hours Changed",
      message: "Please note that our store hours have changed. Visit our website for updated timings.",
      type: "system"
    },
    {
      title: "Maintenance Notice",
      message: "Our website will be undergoing maintenance tonight from 11 PM to 1 AM. We apologize for any inconvenience.",
      type: "alert"
    }
  ];

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getAllNotifications({ page, limit: 10 });
      // Handle both array response and object with notifications property
      const notificationsData = Array.isArray(data) 
        ? data 
        : (data.notifications || []);
      
      // Since backend now properly handles broadcast notifications, we can display them directly
      // Filter out cleared notifications
      const clearedIds = JSON.parse(localStorage.getItem('clearedNotificationIds') || '[]');
      const filteredNotifications = notificationsData.filter(notification => 
        !clearedIds.includes(notification._id)
      );
      
      const grouped = filteredNotifications.map(notification => {
        // If notification has target_role, it's a broadcast
        if (notification.target_role) {
          return {
            ...notification,
            is_broadcast_group: true,
            user: null // Override user to show "Everyone"
          };
        }
        return notification;
      });
      
      setNotifications(grouped);
      
      // Set pagination data if available
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      showError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch all customers without pagination
      const data = await getAllUsers({ role: "customer", limit: 1000 });
      // Handle both array response and object with users property
      const usersData = Array.isArray(data) 
        ? data 
        : (data.users || []);
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showError("Failed to load users");
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  useEffect(() => {
    if (showUserSelectModal) {
      fetchUsers();
    }
  }, [showUserSelectModal]);

  const applyTemplate = (template) => {
    setBroadcastForm(prev => ({
      ...prev,
      title: template.title,
      message: template.message,
      type: template.type
    }));
  };

  const handleBroadcastChange = (field, value) => {
    setBroadcastForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBroadcastSubmit = async (e) => {
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
        sent_by: "admin",
        sendEmail: sendEmail
      });
      
      showSuccess(broadcastForm.isBroadcast ? "Broadcast sent to all users!" : "Notification created!");
      setShowBroadcastModal(false);
      setSendEmail(false);
      setBroadcastForm({
        title: "",
        message: "",
        type: "system",
        isBroadcast: true
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to send notification:", error);
      showError("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const handleSendToUser = async (e) => {
    e.preventDefault();
    
    if (!selectedUser || !broadcastForm.title.trim() || !broadcastForm.message.trim()) {
      showError("Please select a user and fill in title and message");
      return;
    }
    
    try {
      setSending(true);
      await createNotification({
        user: selectedUser, // Specific user ID
        title: broadcastForm.title,
        message: broadcastForm.message,
        type: broadcastForm.type,
        sent_by: "admin",
        sendEmail: sendEmail
      });
      
      showSuccess(`Notification sent to user successfully!`);
      setShowUserSelectModal(false);
      setSelectedUser(null);
      setSendEmail(false);
      setBroadcastForm({
        title: "",
        message: "",
        type: "system",
        isBroadcast: true
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to send notification:", error);
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

  const handleDeleteAllBroadcasts = () => {
    if (window.confirm("Are you sure you want to clear all broadcast notifications from the view? This will only hide them from this page.")) {
      // Get current cleared IDs from localStorage
      const clearedIds = JSON.parse(localStorage.getItem('clearedNotificationIds') || '[]');
      
      // Add broadcast notification IDs to cleared list
      const broadcastNotifications = notifications.filter(notification => notification.is_broadcast_group);
      const newClearedIds = [...clearedIds, ...broadcastNotifications.map(n => n._id)];
      
      // Save to localStorage
      localStorage.setItem('clearedNotificationIds', JSON.stringify(newClearedIds));
      
      // Filter out broadcast notifications from the current view
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => !notification.is_broadcast_group)
      );
      showSuccess("Broadcast notifications cleared from view");
    }
  };

  const handleDeleteAllNotifications = () => {
    if (window.confirm("Are you sure you want to clear all notifications from the view? This will only hide them from this page.")) {
      // Get current cleared IDs from localStorage
      const clearedIds = JSON.parse(localStorage.getItem('clearedNotificationIds') || '[]');
      
      // Add all notification IDs to cleared list
      const newClearedIds = [...clearedIds, ...notifications.map(n => n._id)];
      
      // Save to localStorage
      localStorage.setItem('clearedNotificationIds', JSON.stringify(newClearedIds));
      
      // Clear all notifications from the current view
      setNotifications([]);
      showSuccess("All notifications cleared from view");
    }
  };

  const handleDeleteAllIndividualNotifications = () => {
    if (window.confirm("Are you sure you want to clear all individual notifications from the view? This will only hide them from this page.")) {
      // Get current cleared IDs from localStorage
      const clearedIds = JSON.parse(localStorage.getItem('clearedNotificationIds') || '[]');
      
      // Add individual notification IDs to cleared list
      const individualNotifications = notifications.filter(notification => !notification.is_broadcast_group);
      const newClearedIds = [...clearedIds, ...individualNotifications.map(n => n._id)];
      
      // Save to localStorage
      localStorage.setItem('clearedNotificationIds', JSON.stringify(newClearedIds));
      
      // Filter out individual notifications from the current view
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.is_broadcast_group)
      );
      showSuccess("Individual notifications cleared from view");
    }
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
      case "payment":
        return "bg-purple-100 text-purple-700";
      case "delivery":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      showSuccess("Marked as read");
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
      showError("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(user?._id);
      showSuccess("All notifications marked as read");
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
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
    } catch (error) {
      console.error("Failed to delete notification:", error);
      showError("Failed to delete notification");
    }
  };

  return (
    <div className="p-6">
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
                  className={`px-3 py-1.5 rounded-md text-sm transition ${
                    filter === "all"
                      ? "bg-pink-100 text-pink-700 border border-pink-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-3 py-1.5 rounded-md text-sm transition ${
                    filter === "unread"
                      ? "bg-pink-100 text-pink-700 border border-pink-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Unread
                </button>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('clearedNotificationIds');
                  fetchNotifications(); // Refresh to show all notifications
                  showSuccess("All notifications restored");
                }}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
              >
                Restore All
              </button>
              <button
                onClick={handleDeleteAllBroadcasts}
                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition text-sm flex items-center gap-1"
              >
                <FaTrash size={12} />
                Broadcasts
              </button>
              <button
                onClick={handleDeleteAllIndividualNotifications}
                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition text-sm flex items-center gap-1"
              >
                <FaTrash size={12} />
                Individual
              </button>
              <button
                onClick={handleDeleteAllNotifications}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition text-sm flex items-center gap-1"
              >
                <FaTrash size={12} />
                All
              </button>
              <button
                onClick={() => setShowUserSelectModal(true)}
                className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition text-sm flex items-center gap-1"
              >
                <FaBell size={12} />
                User
              </button>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition text-sm flex items-center gap-1"
              >
                <FaBullhorn size={12} />
                Broadcast
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition text-sm flex items-center gap-1"
                >
                  <FaCheckDouble size={12} />
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
            <>
              {notifications.map((notification) => (
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
                        {notification.is_broadcast_group ? (
                          <span>To: Everyone (Broadcast)</span>
                        ) : notification.user && notification.user.name ? (
                          <span>To: {notification.user.name}</span>
                        ) : (
                          <span>To: Everyone</span>
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
              ))}
              
              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.totalItems}</span> notifications
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchNotifications(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className={`px-4 py-2 text-sm rounded-md ${pagination.currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchNotifications(pageNum)}
                          className={`px-4 py-2 text-sm rounded-md ${pageNum === pagination.currentPage 
                            ? 'bg-pink-500 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => fetchNotifications(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className={`px-4 py-2 text-sm rounded-md ${pagination.currentPage === pagination.totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* User Select Modal */}
      {showUserSelectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaBell className="text-purple-500 text-2xl" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Send Notification to User
                  </h3>
                  <p className="text-sm text-gray-500">
                    Select a user and send them a notification
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUserSelectModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSendToUser} className="p-6 space-y-4">
              {/* User Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select User <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedUser || ""}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Templates
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {notificationTemplates.map((template, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className="text-left p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                      <div className="font-medium">{template.title}</div>
                      <div className="text-gray-600 truncate">{template.message}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter notification title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  onChange={(e) => setBroadcastForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter notification message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Type
                </label>
                <select
                  value={broadcastForm.type}
                  onChange={(e) => setBroadcastForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="system">System</option>
                  <option value="order">Order</option>
                  <option value="payment">Payment</option>
                  <option value="delivery">Delivery</option>
                  <option value="promo">Promotion</option>
                  <option value="alert">Alert</option>
                </select>
              </div>

              {/* Email Notification Option */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendEmailUser"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sendEmailUser" className="ml-2 block text-sm text-gray-700">
                  Also send as email notification
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserSelectModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaBell />
                      Send to User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

            <form onSubmit={handleBroadcastSubmit} className="p-6 space-y-4">
              {/* Toggle */}
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
                  onClick={() => setBroadcastForm(prev => ({ ...prev, isBroadcast: !prev.isBroadcast }))}
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

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Templates
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {notificationTemplates.map((template, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className="text-left p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                      <div className="font-medium">{template.title}</div>
                      <div className="text-gray-600 truncate">{template.message}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm(prev => ({ ...prev, title: e.target.value }))}
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

              {/* Type Selection */}
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

              {/* Email Notification Option */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendEmailBroadcast"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sendEmailBroadcast" className="ml-2 block text-sm text-gray-700">
                  Also send as email notification
                </label>
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
};

export default Notifications;
