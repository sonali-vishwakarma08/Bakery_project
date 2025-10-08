const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db.js');

// Import routes
const productRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userAuthRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Connect to DB and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});