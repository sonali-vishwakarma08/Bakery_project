const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Verify JWT token and attach user to request
exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔍 Decoded token:", decoded);

    // Fetch user from DB
    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) {
      console.error("❌ User not found for userId:", decoded.userId);
      return res.status(404).json({ 
        message: "User not found. Please login again or ensure admin user exists in database." 
      });
    }

    console.log("✅ User authenticated:", user.email, "Role:", user.role);
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Token verification error:", err.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Require admin role
exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access required" });
  next();
};

// Require customer role
exports.requireCustomer = (req, res, next) => {
  if (req.user.role !== "customer")
    return res.status(403).json({ message: "Customer access required" });
  next();
};
