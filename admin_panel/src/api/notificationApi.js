import API from "./api";

// Get all notifications
export const getAllNotifications = async (filters = {}) => {
  try {
    const res = await API.post("/notifications/all", filters);
    return res.data;
  } catch (error) {
    console.error("Error fetching notifications:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch notifications" };
  }
};

// Get single notification by ID
export const getNotificationById = async (notificationId) => {
  try {
    const res = await API.post("/notifications/get", { id: notificationId });
    return res.data;
  } catch (error) {
    console.error("Error fetching notification:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch notification" };
  }
};

// Create notification
export const createNotification = async (notificationData) => {
  try {
    const res = await API.post("/notifications/create", notificationData);
    return res.data;
  } catch (error) {
    console.error("Error creating notification:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create notification" };
  }
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  try {
    const res = await API.post("/notifications/read", { id: notificationId });
    return res.data;
  } catch (error) {
    console.error("Error marking notification as read:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to mark as read" };
  }
};

// Mark all notifications as read
export const markAllAsRead = async (userId) => {
  try {
    const res = await API.post("/notifications/read-all", { user: userId });
    return res.data;
  } catch (error) {
    console.error("Error marking all as read:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to mark all as read" };
  }
};

// Get unread count
export const getUnreadCount = async (userId) => {
  try {
    const res = await API.post("/notifications/unread-count", { user: userId });
    return res.data;
  } catch (error) {
    console.error("Error fetching unread count:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch unread count" };
  }
};

// Broadcast notification
export const broadcastNotification = async (notificationData) => {
  try {
    const res = await API.post("/notifications/broadcast", notificationData);
    return res.data;
  } catch (error) {
    console.error("Error broadcasting notification:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to broadcast notification" };
  }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  try {
    const res = await API.post("/notifications/delete", { id: notificationId });
    return res.data;
  } catch (error) {
    console.error("Error deleting notification:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete notification" };
  }
};

// Clear all notifications
export const clearAllNotifications = async (userId) => {
  try {
    const res = await API.post("/notifications/clear-all", { user: userId });
    return res.data;
  } catch (error) {
    console.error("Error clearing notifications:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to clear notifications" };
  }
};
