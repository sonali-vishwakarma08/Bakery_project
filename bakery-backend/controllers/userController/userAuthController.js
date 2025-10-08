const User = require('../../models/userModel');
const { generateToken } = require('../../utils/jwt');
const { hashPassword, comparePassword } = require('../../utils/password');
const sendEmail = require('../../utils/email');
const { OAuth2Client } = require('google-auth-library');
const { verifyAppleToken } = require('../../utils/appleAuth');
const crypto = require('crypto');

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

module.exports = {
  // ===== LOCAL REGISTER =====
  register: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      if (await User.findOne({ email })) return res.status(400).json({ message: 'Email exists' });

      const user = await User.create({
        name,
        email,
        phone,
        passwordHash: await hashPassword(password),
        auth_provider: 'local'
      });

      res.status(201).json({ token: generateToken(user._id), user });
    } catch (e) { res.status(500).json({ message: e.message }); }
  },

  // ===== LOCAL LOGIN =====
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email, auth_provider: 'local' });
      if (!user || !(await comparePassword(password, user.passwordHash)))
        return res.status(400).json({ message: 'Invalid credentials' });

      res.json({ token: generateToken(user._id), user });
    } catch (e) { res.status(500).json({ message: e.message }); }
  },

  // ===== GOOGLE LOGIN =====
  googleLogin: async (req, res) => {
    try {
      const { token } = req.body;
      const ticket = await googleClient.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
      const { email, name, picture } = ticket.getPayload();

      let user = await User.findOne({ email });
      if (!user) user = await User.create({ name, email, profile_image: picture, auth_provider: 'google' });

      res.json({ token: generateToken(user._id), user });
    } catch (e) { res.status(400).json({ message: 'Google login failed' }); }
  },

  // ===== APPLE LOGIN =====
  appleLogin: async (req, res) => {
    try {
      const { token } = req.body;
      const payload = await verifyAppleToken(token);

      let user = await User.findOne({ apple_id: payload.sub });
      if (!user)
        user = await User.create({
          name: payload.name || 'Apple User',
          email: payload.email,
          apple_id: payload.sub,
          auth_provider: 'apple'
        });

      res.json({ token: generateToken(user._id), user });
    } catch (e) { res.status(400).json({ message: 'Apple login failed' }); }
  },

  // ===== FORGOT PASSWORD =====
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email, auth_provider: 'local' });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const otp = crypto.randomInt(100000, 999999).toString();
      user.otp = otp;
      user.otp_expiry = Date.now() + 10 * 60 * 1000; // 10 min
      await user.save();

      await sendEmail(user.email, 'Password Reset OTP', `Your OTP is: ${otp}`);
      res.json({ message: 'OTP sent to your email' });
    } catch (e) { res.status(500).json({ message: e.message }); }
  },

  // ===== RESET PASSWORD =====
  resetPassword: async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      const user = await User.findOne({ email, otp, otp_expiry: { $gt: Date.now() } });
      if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

      user.passwordHash = await hashPassword(newPassword);
      user.otp = null;
      user.otp_expiry = null;
      await user.save();

      res.json({ message: 'Password reset successfully' });
    } catch (e) { res.status(500).json({ message: e.message }); }
  },

  // ===== LOGOUT =====
  logout: async (req, res) => {
    try {
      res.json({ message: 'Logged out successfully' });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
};
