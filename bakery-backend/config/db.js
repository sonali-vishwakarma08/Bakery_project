const mongoose = require('mongoose');
const models = require('../models/index'); // your models index file

const connectDB = async () => {
  try {
    // Check if MONGO_URI is set
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not set in .env file');
      throw new Error('MONGO_URI is not configured');
    }

    // Connection options with timeout and retry
    const options = {
      serverSelectionTimeoutMS: 30000, // Timeout after 30s (increased for reliability)
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 30000, // Give up initial connection after 30s
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
      retryReads: true,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    // Sync all models to database - create collections and indexes
    console.log('🔄 Syncing all models to database...');
    try {
      const modelNames = Object.keys(models);
      const syncedModels = [];

      for (const modelName of modelNames) {
        const Model = models[modelName];
        
        // Create collection if it doesn't exist (this ensures the collection is created)
        await Model.createCollection().catch((err) => {
          // Collection might already exist, ignore "NamespaceExists" errors
          if (err.code !== 48 && err.codeName !== 'NamespaceExists') {
            console.warn(`⚠️ Warning creating collection for ${modelName}:`, err.message);
          }
        });

        // Sync indexes - this ensures all indexes defined in schemas are created
        // syncIndexes() only creates missing indexes, doesn't recreate existing ones
        await Model.syncIndexes().catch((err) => {
          console.warn(`⚠️ Warning syncing indexes for ${modelName}:`, err.message);
        });

        syncedModels.push(modelName);
      }

      console.log(`✅ Successfully synced ${syncedModels.length} models to database:`);
      syncedModels.forEach(name => {
        console.log(`   ✓ ${name} (with automatic timestamps: createdAt, updatedAt)`);
      });
      
      console.log('📝 Note: All models include automatic timestamps (createdAt, updatedAt)');
    } catch (syncError) {
      console.warn('⚠️ Warning during model sync:', syncError.message);
      console.warn('   Models will be created automatically on first use');
    }

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Troubleshooting steps:');
    console.error('   1. Check if MongoDB is running:');
    console.error('      - Local: mongod should be running');
    console.error('      - Atlas: Check cluster status in MongoDB Atlas dashboard');
    console.error('   2. Verify MONGO_URI in .env file is correct');
    console.error('   3. Check network/firewall settings');
    console.error('   4. For local MongoDB, try: mongodb://localhost:27017/bakery');
    console.error('   5. For Atlas, ensure IP whitelist includes your IP');
    
    // Provide more specific error details
    if (error.message.includes('timeout')) {
      console.error('   ⏱️  Connection timeout - MongoDB server may be slow to respond or unreachable');
    } else if (error.message.includes('authentication')) {
      console.error('   🔐 Authentication failed - Check username/password in MONGO_URI');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   🌐 DNS resolution failed - Check if MongoDB hostname is correct');
    }
    
    throw error; // Re-throw to let server.js handle it
  }
};

module.exports = connectDB;
