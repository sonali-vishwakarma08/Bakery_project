const axios = require('axios');

// Test script to send a notification
async function sendTestNotification() {
  try {
    // You'll need to replace this with a valid admin JWT token
    const adminToken = "YOUR_ADMIN_JWT_TOKEN_HERE";
    
    const notificationData = {
      title: "Test Notification",
      body: "This is a test notification from the bakery system!",
      data: {
        type: "system",
        content: "Test content"
      },
      sendEmail: false
    };
    
    // Send as broadcast to all users
    const response = await axios.post('http://localhost:5000/api/notifications/broadcast', notificationData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error.response?.data || error.message);
  }
}

sendTestNotification();