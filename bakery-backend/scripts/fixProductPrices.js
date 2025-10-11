const mongoose = require('mongoose');
const Product = require('../models/productModel');

// MongoDB connection string - update if needed
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bakery';

async function fixProductPrices() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all products with undefined or null prices
    const productsWithoutPrice = await Product.find({
      $or: [
        { price: { $exists: false } },
        { price: null },
        { price: undefined }
      ]
    });

    console.log(`\n📊 Found ${productsWithoutPrice.length} products without prices:\n`);

    if (productsWithoutPrice.length === 0) {
      console.log('✅ All products have prices set!');
      process.exit(0);
    }

    // Display products
    productsWithoutPrice.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (ID: ${product._id})`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Stock: ${product.stock_quantity}`);
      console.log(`   Current Price: ${product.price}`);
      console.log('');
    });

    console.log('\n💡 Options to fix:');
    console.log('1. Set a default price (e.g., ₹100) for all products');
    console.log('2. Delete products without prices');
    console.log('3. Exit and fix manually via Admin Panel\n');

    // For automation, uncomment one of these:
    
    // OPTION 1: Set default price of ₹100
    // const result = await Product.updateMany(
    //   { $or: [{ price: { $exists: false } }, { price: null }] },
    //   { $set: { price: 100 } }
    // );
    // console.log(`✅ Updated ${result.modifiedCount} products with default price ₹100`);

    // OPTION 2: Delete products without prices
    // const result = await Product.deleteMany(
    //   { $or: [{ price: { $exists: false } }, { price: null }] }
    // );
    // console.log(`🗑️ Deleted ${result.deletedCount} products without prices`);

    console.log('⚠️ Script is in read-only mode. Uncomment code to apply fixes.');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixProductPrices();
