const mongoose = require('mongoose');
const models = require('../models/index'); // your models index file

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    // Ensure all collections exist
    for (const modelName in models) {
      await models[modelName].createCollection();
      console.log(`Collection ensured: ${modelName}`);
    }

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
