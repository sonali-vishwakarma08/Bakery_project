import { messaging, getToken, onMessage } from "../config/firebase";
import { toast } from "react-toastify";

// Store for message listeners
let messageListenerRegistered = false;

// Request permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      console.log("❌ Notifications not supported in this browser");
      return null;
    }

    console.log("📋 Current notification permission:", Notification.permission);

    // If already granted, try to get token
    if (Notification.permission === "granted") {
      console.log("✅ Notification permission already granted");
      return await getFCMToken();
    }

    // If previously denied, can't ask again
    if (Notification.permission === "denied") {
      console.warn("⚠️ Notifications are blocked. Enable in browser settings: Lock icon → Notifications → Allow");
      return null;
    }

    // Ask for permission (permission is 'default' at this point)
    console.log("🎯 Showing notification permission dialog...");
    const permission = await Notification.requestPermission();
    console.log("📍 Permission result:", permission);
    
    if (permission === "granted") {
      console.log("✅ User granted notification permission!");
      return await getFCMToken();
    }

    console.log("⚠️ User did not grant notification permission");
    return null;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};

// Get FCM token
export const getFCMToken = async () => {
  try {
    if (!messaging) {
      console.warn("Firebase Messaging is not available");
      return null;
    }

    console.log("Attempting to get FCM token...");
    
    // IMPORTANT: Replace with your actual VAPID key from Firebase Console
    const token = await getToken(messaging, {
      vapidKey: "BDunJHqPbc-7R12_kPiISiiy0JMMnxadalyeotnpOD-sJwZMvxQ8g1KOZoVKe4CTNctLqmoZyaCIwiFmNCanGIc",
    }).catch((error) => {
      console.warn("Unable to get FCM token - skipping service worker:", error.message);
      return null;
    });

    if (token) {
      console.log("✅ FCM Token obtained successfully:", token);
      localStorage.setItem("fcmToken", token);
      return token;
    } else {
      console.log("⚠️ No FCM token - App will still receive foreground notifications");
    }
    return null;
  } catch (error) {
    console.warn("Error getting FCM token:", error);
    return null;
  }
};

// Listen to foreground messages with fallback
export const listenToForegroundMessages = () => {
  // Only register once
  if (messageListenerRegistered) {
    console.log("Message listener already registered");
    return;
  }

  if (messaging) {
    try {
      onMessage(messaging, (payload) => {
        console.log("Foreground message received via Firebase:", payload);
        displayNotification(payload);
      });
      console.log("✅ Firebase message listener registered");
      messageListenerRegistered = true;
    } catch (error) {
      console.warn("Error registering Firebase message listener:", error);
    }
  } else {
    console.log("Firebase Messaging not available - using polling fallback");
  }
  
  // ALWAYS start polling as fallback for cases without FCM token
  console.log("🔄 Starting notification polling (fallback)...");
  startNotificationPolling();
};

// Fallback: Poll backend for new notifications
let pollingInterval = null;
// let lastNotificationCheckTime = Date.now(); // Not used anymore
let displayedNotificationIds = new Set();

const startNotificationPolling = () => {
  if (pollingInterval) return; // Already polling

  console.log("🔄 Starting notification polling fallback...");
  
  pollingInterval = setInterval(async () => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) return;

      const response = await fetch("http://localhost:5000/api/notifications/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("📥 Polling response:", data);
        
        if (data.notifications && data.notifications.length > 0) {
          console.log(`Found ${data.notifications.length} unread notifications`);
          // Check for new notifications - display only the ones we haven't shown yet
          data.notifications.forEach(notification => {
            // Use notification ID or title+time as unique key
            const notificationKey = notification._id || `${notification.title}-${notification.sentAt}`;
            
            // Only display if we haven't shown this notification before
            if (!displayedNotificationIds.has(notificationKey)) {
              console.log(`✨ New notification detected: ${notification.title}`);
              displayNotification({
                notification: {
                  title: notification.title,
                  body: notification.body,
                  icon: "/cake-icon.png"
                },
                data: notification.data || {}
              });
              // Mark this notification as displayed
              displayedNotificationIds.add(notificationKey);
            }
          });
        }
      } else {
        console.warn("Polling returned non-OK status:", response.status);
      }
    } catch (error) {
      console.warn("Polling error:", error);
    }
  }, 5000); // Poll every 5 seconds
};

// Display notification (used by both Firebase and polling)
const displayNotification = (payload) => {
  try {
    const notificationTitle = payload.notification?.title || payload.title || "New Notification";
    const notificationBody = payload.notification?.body || payload.body || "You have a new message";
    const notificationIcon = payload.notification?.icon || "/cake-icon.png";

    console.log("📢 Preparing to display notification:", { notificationTitle, notificationBody });

    // Show toast notification
    toast.info(`${notificationTitle}\n${notificationBody}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Show browser notification if permission granted
    if ("Notification" in window && Notification.permission === "granted") {
      console.log("🔔 Creating browser notification...");
      new Notification(notificationTitle, {
        body: notificationBody,
        icon: notificationIcon,
        badge: "/cake-badge.png",
        tag: "bakery-notification",
      });
    } else {
      console.log("⚠️ Browser notification permission not granted");
    }
  } catch (error) {
    console.error("❌ Error displaying notification:", error);
  }
};

// Simplified service worker registration - optional
export const registerServiceWorker = async () => {
  try {
    if ("serviceWorker" in navigator) {
      console.log("Service Worker support available (optional for notifications)");
      // Optional - app works fine without it for foreground notifications
      return true;
    }
  } catch (error) {
    console.warn("Service Worker not available", error.message);
    return false;
  }
};

// Send device token to backend
export const sendTokenToBackend = async (token) => {
  try {
    const backendURL = "http://localhost:5000/api";
    const authToken = localStorage.getItem("token");

    if (!authToken) {
      console.log("User not authenticated, skipping token send");
      return;
    }

    // If no FCM token, mark user as notification-ready for foreground notifications
    if (!token) {
      console.log("✅ User is notification-ready (foreground notifications enabled)");
      localStorage.setItem("notificationsEnabled", "true");
      return;
    }

    const response = await fetch(`${backendURL}/notifications/device-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ fcmToken: token }),
    });

    if (response.ok) {
      console.log("✅ Device token sent to backend successfully");
      localStorage.setItem("notificationsEnabled", "true");
    } else {
      console.warn("Failed to send device token to backend");
    }
  } catch (error) {
    console.warn("Error sending token to backend:", error);
  }
};

export default {
  requestNotificationPermission,
  getFCMToken,
  listenToForegroundMessages,
  registerServiceWorker,
  sendTokenToBackend,
};
