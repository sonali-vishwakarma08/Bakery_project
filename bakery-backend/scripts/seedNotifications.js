const mongoose = require('mongoose');
require('dotenv').config();

const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

const sampleNotifications = [
  {
    title: '🎉 Welcome to Sweet Delights Bakery!',
    message: 'Thank you for joining us! Explore our delicious range of cakes, pastries, and breads.',
    type: 'system',
    sent_by: 'system'
  },
  {
    title: '🍰 New Product Alert',
    message: 'Check out our new Chocolate Truffle Cake - now available with 20% off!',
    type: 'promo',
    sent_by: 'admin'
  },
  {
    title: '📦 Order Update',
    message: 'Your recent order has been confirmed and is being prepared.',
    type: 'order',
    sent_by: 'system'
  },
  {
    title: '⚠️ Low Stock Alert',
    message: 'Some products are running low on stock. Please restock soon.',
    type: 'alert',
    sent_by: 'system'
  },
  {
    title: '💝 Special Offer',
    message: 'Get 15% off on all birthday cakes this weekend! Use code: BIRTHDAY15',
    type: 'promo',
    sent_by: 'admin'
  },
  {
    title: '✅ Payment Received',
    message: 'Payment of ₹850 has been successfully received for Order #12345',
    type: 'order',
    sent_by: 'system'
  },
  {
    title: '🚚 Order Shipped',
    message: 'Your order #12346 has been shipped and will arrive soon!',
    type: 'order',
    sent_by: 'system'
  },
  {
    title: '🔔 System Maintenance',
    message: 'Scheduled maintenance on Sunday 2 AM - 4 AM. Service may be temporarily unavailable.',
    type: 'alert',
    sent_by: 'system'
  }
];

async function seedNotifications() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all admin users
    const admins = await User.find({ role: 'admin' });
    
    if (admins.length === 0) {
      console.log('⚠️ No admin users found. Please create an admin user first.');
      process.exit(1);
    }

    console.log(`Found ${admins.length} admin user(s)`);

    // Clear existing notifications (optional)
    await Notification.deleteMany({});
    console.log('🗑️ Cleared existing notifications');

    // Create notifications for each admin
    const notifications = [];
    for (const admin of admins) {
      for (const notif of sampleNotifications) {
        notifications.push({
          ...notif,
          user: admin._id
        });
      }
    }

    // Insert notifications
    const result = await Notification.insertMany(notifications);
    console.log(`✅ Created ${result.length} notifications`);

    // Also create some broadcast notifications (user: null)
    const broadcastNotifications = [
      {
        user: null,
        title: '📢 System Announcement',
        message: 'New features have been added to the admin panel. Check them out!',
        type: 'system',
        sent_by: 'system'
      },
      {
        user: null,
        title: '🎊 Holiday Special',
        message: 'Special discounts on all products for the holiday season!',
        type: 'promo',
        sent_by: 'admin'
      }
    ];

    await Notification.insertMany(broadcastNotifications);
    console.log('✅ Created broadcast notifications');

    console.log('\n🎉 Notification seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding notifications:', error);
    process.exit(1);
  }
}

seedNotifications();
