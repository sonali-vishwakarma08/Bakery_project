# Notification API Documentation

## Overview
Complete notification system with real-time alerts, broadcasts, and user-specific notifications.

---

## Backend API Endpoints

### Base URL
```
http://localhost:5000/api/notifications
```

### Authentication
All endpoints require authentication token in headers:
```
Authorization: Bearer <token>
```

---

## API Endpoints

### 1. Create Notification
**POST** `/create`  
**Access:** Admin only

**Request Body:**
```json
{
  "user": "userId or null for broadcast",
  "title": "Notification Title",
  "message": "Notification message content",
  "type": "order|system|promo|alert",
  "sent_by": "system|admin"
}
```

**Response:**
```json
{
  "_id": "notificationId",
  "user": "userId",
  "title": "Notification Title",
  "message": "Notification message",
  "type": "order",
  "is_read": false,
  "sent_by": "admin",
  "createdAt": "2025-01-11T07:00:00.000Z"
}
```

---

### 2. Get All Notifications
**POST** `/all`  
**Access:** Authenticated users

**Request Body (Optional Filters):**
```json
{
  "user": "userId",
  "type": "order|system|promo|alert",
  "is_read": true|false
}
```

**Response:**
```json
[
  {
    "_id": "notificationId",
    "user": {
      "_id": "userId",
      "name": "User Name",
      "email": "user@example.com"
    },
    "title": "New Order",
    "message": "You have a new order #12345",
    "type": "order",
    "is_read": false,
    "sent_by": "system",
    "createdAt": "2025-01-11T07:00:00.000Z"
  }
]
```

---

### 3. Get Single Notification
**POST** `/get`  
**Access:** Authenticated users

**Request Body:**
```json
{
  "id": "notificationId"
}
```

**Response:**
```json
{
  "_id": "notificationId",
  "title": "Notification Title",
  "message": "Notification message",
  "type": "system",
  "is_read": false
}
```

---

### 4. Mark as Read
**POST** `/read`  
**Access:** Authenticated users

**Request Body:**
```json
{
  "id": "notificationId"
}
```

**Response:**
```json
{
  "_id": "notificationId",
  "is_read": true,
  "title": "Notification Title"
}
```

---

### 5. Mark All as Read
**POST** `/read-all`  
**Access:** Authenticated users

**Request Body:**
```json
{
  "user": "userId"
}
```

**Response:**
```json
{
  "message": "All notifications marked as read."
}
```

---

### 6. Get Unread Count
**POST** `/unread-count`  
**Access:** Authenticated users

**Request Body:**
```json
{
  "user": "userId"
}
```

**Response:**
```json
{
  "count": 5
}
```

---

### 7. Broadcast Notification
**POST** `/broadcast`  
**Access:** Admin only

**Request Body:**
```json
{
  "title": "System Maintenance",
  "message": "System will be down for maintenance",
  "type": "system"
}
```

**Response:**
```json
{
  "message": "Broadcast notification created successfully.",
  "notification": {
    "_id": "notificationId",
    "user": null,
    "title": "System Maintenance",
    "message": "System will be down for maintenance",
    "type": "system",
    "sent_by": "admin"
  }
}
```

---

### 8. Delete Notification
**POST** `/delete`  
**Access:** Admin only

**Request Body:**
```json
{
  "id": "notificationId"
}
```

**Response:**
```json
{
  "message": "Notification deleted successfully.",
  "notification": {
    "_id": "notificationId",
    "is_deleted": true
  }
}
```

---

### 9. Clear All Notifications
**POST** `/clear-all`  
**Access:** Authenticated users

**Request Body:**
```json
{
  "user": "userId"
}
```

**Response:**
```json
{
  "message": "All notifications cleared successfully."
}
```

---

## Notification Types

- **order** - Order-related notifications
- **system** - System announcements
- **promo** - Promotional offers
- **alert** - Important alerts

---

## Frontend Usage

### Import API Functions
```javascript
import {
  getAllNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  broadcastNotification,
  deleteNotification,
  clearAllNotifications
} from "../api/notificationApi";
```

### Example: Fetch Notifications
```javascript
const fetchNotifications = async () => {
  try {
    const filters = {
      is_read: false, // Only unread
      type: "order"   // Only order notifications
    };
    const notifications = await getAllNotifications(filters);
    console.log(notifications);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### Example: Mark as Read
```javascript
const handleMarkAsRead = async (notificationId) => {
  try {
    await markAsRead(notificationId);
    console.log("Marked as read");
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### Example: Broadcast Notification
```javascript
const sendBroadcast = async () => {
  try {
    const data = {
      title: "New Feature Released",
      message: "Check out our new product catalog!",
      type: "system"
    };
    await broadcastNotification(data);
    console.log("Broadcast sent");
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### Example: Get Unread Count
```javascript
const fetchUnreadCount = async (userId) => {
  try {
    const { count } = await getUnreadCount(userId);
    console.log(`Unread notifications: ${count}`);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

## Features Implemented

✅ **Create Notifications** - Send targeted or broadcast notifications  
✅ **Filter Notifications** - By type, read status, user  
✅ **Mark as Read** - Individual or bulk mark as read  
✅ **Unread Count** - Real-time unread notification count  
✅ **Broadcast** - Send notifications to all users  
✅ **Soft Delete** - Notifications are soft-deleted, not permanently removed  
✅ **Type Classification** - Order, System, Promo, Alert types  
✅ **User Population** - Notifications include user details  
✅ **Timestamps** - Automatic creation and update timestamps  

---

## Admin Panel Features

### Notifications Page (`/notifications`)

**Features:**
- View all notifications with filters
- Filter by read/unread status
- Filter by notification type
- Mark individual notifications as read
- Mark all notifications as read
- Delete individual notifications
- Clear all notifications
- Broadcast notifications to all users
- Real-time unread count badge
- Relative time display (e.g., "5 mins ago")
- Type-based icons and colors

**Access:** Available in sidebar under "Notifications"

---

## Database Model

```javascript
{
  user: ObjectId (ref: 'User') | null,  // null = broadcast
  title: String (required),
  message: String (required),
  type: String (enum: ['order', 'system', 'promo', 'alert']),
  is_read: Boolean (default: false),
  sent_by: String (enum: ['system', 'admin']),
  is_deleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ user: 1, is_read: 1 }` - Fast user notification queries
- `{ type: 1 }` - Fast type filtering
- `{ is_deleted: 1 }` - Exclude deleted notifications

---

## Testing the API

### Using Postman/Thunder Client

1. **Login** to get authentication token
2. **Set Authorization Header:**
   ```
   Authorization: Bearer <your_token>
   ```

3. **Test Endpoints:**
   - Create notification
   - Get all notifications
   - Mark as read
   - Broadcast notification

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request (missing required fields)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Server Error

**Error Response Format:**
```json
{
  "message": "Error description"
}
```

---

## Best Practices

1. **Always filter deleted notifications** - Use `is_deleted: false` in queries
2. **Use broadcast sparingly** - Avoid spamming users
3. **Set appropriate types** - Use correct notification types for better organization
4. **Clean up old notifications** - Implement periodic cleanup of old read notifications
5. **Real-time updates** - Consider implementing WebSocket for real-time notifications

---

## Future Enhancements

- WebSocket/Socket.io for real-time push notifications
- Email/SMS integration for critical notifications
- Notification preferences per user
- Scheduled notifications
- Notification templates
- Rich media support (images, links)
- Push notifications for mobile apps

---

## Support

For issues or questions, contact the development team.
