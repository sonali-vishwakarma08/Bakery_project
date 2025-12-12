// ================== IMPORTS ==================
require("dotenv").config(); // Load .env variables
const express = require("express");
const cors = require("cors");
const path = require("path"); // ✅ FIX: Import path
const mongoose = require("mongoose"); // Import mongoose to check connection state
const connectDB = require("./config/db.js"); // your MongoDB connection function
require('./config/firebase-admin');
// ================== INITIALIZE EXPRESS ==================
const app = express();

// ================== CORS CONFIGURATION ==================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        const msg = `❌ CORS: Origin ${origin} not allowed`;
        console.warn(msg);
        return callback(new Error(msg), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ================== BODY PARSERS ==================
// Capture raw body for webhook signature verification (PayPal webhooks)
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString('utf8');
  }
}));
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================== ROUTES ==================
const routes = require("./routes"); // make sure you export routes properly from ./routes/index.js
app.use("/api", routes);

// Default route
app.get("/", (req, res) => {
  res.send("✅ Bakery API is running...");
});

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;

// Start server even if DB connection fails (for development/testing)
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database connection established');
  } catch (err) {
    console.error("⚠️ Warning: MongoDB connection failed:", err.message);
    console.error("⚠️ Server will start but database operations will fail");
    console.error("💡 To fix: Check your MONGO_URI in .env file");
    console.error("   Common fixes:");
    console.error("   - Start MongoDB service: mongod (or check MongoDB service status)");
    console.error("   - Verify .env file has correct MONGO_URI");
    console.error("   - For local: mongodb://localhost:27017/bakery");
    console.error("   - For Atlas: Check connection string format and IP whitelist");
    
    // Optionally exit in production, but allow in development
    if (process.env.NODE_ENV === 'production') {
      console.error("❌ Exiting in production mode due to DB connection failure");
      process.exit(1);
    }
  }

  // Start server regardless of DB connection status
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    if (!mongoose.connection.readyState) {
      console.warn("⚠️ Database not connected - some features may not work");
    }
  });
};

startServer();
