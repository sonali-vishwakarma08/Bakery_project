const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Verify JWT token and attach user object to req.user
exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB (excluding password hash)
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user; // Attach user object to request
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Require admin role
exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

// Require customer role
exports.requireCustomer = (req, res, next) => {
  if (req.user.role !== 'customer') return res.status(403).json({ message: 'Customer access required' });
  next();
};
