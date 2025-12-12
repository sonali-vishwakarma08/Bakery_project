import API from "./api";

export const getAllNotifications = async (params = {}) => {
  try {
    const res = await API.post("/notifications/all", params);
    // Return the data directly, handling both array and object responses
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
    // If user is null or not provided, broadcast to all users
    if (notificationData.user === null) {
      const res = await API.post("/notifications/broadcast", {
        title: notificationData.title,
        body: notificationData.message,
        data: {
          type: notificationData.type,
          content: notificationData.content
        },
        sendEmail: notificationData.sendEmail || false
      });
      return res.data;
    }
    
    // Otherwise send to specific user
    const res = await API.post("/notifications/send", {
      userId: notificationData.user,
      title: notificationData.title,
      body: notificationData.message,
      data: {
        type: notificationData.type,
        content: notificationData.content
      },
      sendEmail: notificationData.sendEmail || false
    });
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

export const deleteAllBroadcastNotifications = async () => {
  try {
    const res = await API.post("/notifications/delete-all-broadcasts");
    return res.data;
  } catch (error) {
    console.error("Error deleting all broadcast notifications:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete all broadcast notifications" };
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