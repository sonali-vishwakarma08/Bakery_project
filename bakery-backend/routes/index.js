require('dotenv').config(); // .env variables
const express = require('express');
const connectDB = require('../config/db.js'); // MongoDB connection
const cors = require('cors');

// Import all route files
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON bodies
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Base routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
