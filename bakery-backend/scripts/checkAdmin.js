const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const checkAdmin = async () => {
  try {
    // Check if admin exists
    const admin = await User.findOne({ role: 'admin' });
    
    if (admin) {
      console.log('✅ Admin user found:');
      console.log(`   ID: ${admin._id}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Phone: ${admin.phone}`);
      console.log(`   Role: ${admin.role}`);
    } else {
      console.log('❌ No admin user found in database!');
      console.log('📝 Run the admin seeder to create one:');
      console.log('   node seeder/adminSeeder.js');
    }

    // Count all users
    const userCount = await User.countDocuments();
    console.log(`\n📊 Total users in database: ${userCount}`);

  } catch (err) {
    console.error('❌ Error checking admin:', err);
  } finally {
    process.exit();
  }
};

checkAdmin();
