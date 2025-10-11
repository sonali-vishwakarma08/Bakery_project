// ================== IMPORTS ==================
require("dotenv").config(); // Load .env variables
const express = require("express");
const cors = require("cors");
const path = require("path"); // ✅ FIX: Import path
const connectDB = require("./config/db.js"); // your MongoDB connection function

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
app.use(express.json());
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

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
