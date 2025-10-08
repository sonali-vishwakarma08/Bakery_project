require('dotenv').config(); // Load .env variables
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

// Initialize Express
const app = express();

// ================== CORS CONFIGURATION ==================
const allowedOrigins = [
  'http://localhost:3000', // frontend dev
  process.env.FRONTEND_URL  // frontend production URL from .env
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // allow cookies and auth headers
}));

// ================== BODY PARSERS ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== ROUTES ==================
const routes = require('./routes');
app.use('/api', routes);

// Default route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB', err.message);
    process.exit(1);
  });
