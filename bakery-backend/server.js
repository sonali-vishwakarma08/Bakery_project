require('dotenv').config(); // Load .env variables
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import all routes from central index
const routes = require('./routes');
app.use('/api', routes);

// Default route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB', err.message);
    process.exit(1);
  });
