import API from "./api";

export const getAllNotifications = async (filters = {}) => {
  try {
    const res = await API.post("/notifications/all", filters);
    return res.data;
  } catch (error) {
    console.error("Error fetching notifications:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch notifications" };
  }
};

export const getNotificationById = async (id) => {
  try {
    const res = await API.post("/notifications/get", { id });
    return res.data;
  } catch (error) {
    console.error("Error fetching notification:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch notification" };
  }
};

export const createNotification = async (notificationData) => {
  try {
    const res = await API.post("/notifications/create", notificationData);
    return res.data;
  } catch (error) {
    console.error("Error creating notification:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create notification" };
  }
};

export const markAsRead = async (id) => {
  try {
    const res = await API.post("/notifications/read", { id });
    return res.data;
  } catch (error) {
    console.error("Error marking as read:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to mark as read" };
  }
};

export const markAllAsRead = async (user) => {
  try {
    const res = await API.post("/notifications/read-all", { user });
    return res.data;
  } catch (error) {
    console.error("Error marking all as read:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to mark all as read" };
  }
};

export const deleteNotification = async (id) => {
  try {
    const res = await API.post("/notifications/delete", { id });
    return res.data;
  } catch (error) {
    console.error("Error deleting notification:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete notification" };
  }
};

export const getUnreadCount = async (user) => {
  try {
    const res = await API.post("/notifications/unread-count", { user });
    return res.data;
  } catch (error) {
    console.error("Error fetching unread count:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch unread count" };
  }
};
