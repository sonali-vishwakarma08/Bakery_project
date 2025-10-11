const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/userModel');
const { hashPassword } = require('../utils/password');

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists:', existingAdmin.email);
      return process.exit();
    }

    // Create admin user
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@bakery.com',
      phone: '9999999999',
      passwordHash: await hashPassword('admin123'),
      role: 'admin',
      auth_provider: 'local',
      isEmailVerified: true,
      isPhoneVerified: true
    });

    console.log('✅ Admin created successfully:');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: admin123`);

  } catch (err) {
    console.error('❌ Error creating admin:', err);
  } finally {
    process.exit(); // Exit after completion
  }
};

createAdmin();
