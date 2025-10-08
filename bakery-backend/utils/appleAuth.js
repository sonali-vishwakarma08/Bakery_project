const jwt = require('jsonwebtoken');
const axios = require('axios');

// Verify Apple ID token (minimal example)
const verifyAppleToken = async (idToken) => {
  try {
    // Decode Apple token (JWT) without verification for simplicity
    const decoded = jwt.decode(idToken);
    // For production, verify with Apple's public keys
    return { sub: decoded.sub, email: decoded.email, name: decoded.name };
  } catch (e) {
    throw new Error('Invalid Apple token');
  }
};

module.exports = { verifyAppleToken };
