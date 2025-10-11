require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/userModel');
const Category = require('./models/categoryModel');
const SubCategory = require('./models/subCategoryModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
const Payment = require('./models/paymentModel');
const Coupon = require('./models/couponModel');
const Banner = require('./models/bannerModel');
const DeliveryStaff = require('./models/deliveryStaffModel');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await SubCategory.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Payment.deleteMany({});
    await Coupon.deleteMany({});
    await Banner.deleteMany({});

    // Create Admin User
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@bakery.com',
      phone: '9876543210',
      passwordHash: hashedPassword,
      role: 'admin',
      auth_provider: 'local',
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    // Create 5 Customer Users
    console.log('👥 Creating customer users...');
    const customers = await User.insertMany([
      {
        name: 'Sonali Vishwakarma',
        email: 'sonali@example.com',
        phone: '9876543211',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'customer',
        auth_provider: 'local',
        isEmailVerified: true,
        isPhoneVerified: true,
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543212',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'customer',
        auth_provider: 'local',
        isEmailVerified: true,
      },
      {
        name: 'Sona Vishwakarma',
        email: 'v.sonali6587@gmail.com',
        phone: '9876543213',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'customer',
        auth_provider: 'local',
        isEmailVerified: true,
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '9876543214',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'customer',
        auth_provider: 'local',
      },
      {
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        phone: '9876543215',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'customer',
        auth_provider: 'local',
      },
    ]);

    // Create 5 Categories
    console.log('📁 Creating categories...');
    const categories = await Category.insertMany([
      {
        name: 'Cakes',
        description: 'Delicious cakes for all occasions',
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        name: 'Pastries',
        description: 'Fresh and flaky pastries',
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        name: 'Cookies',
        description: 'Crunchy and soft cookies',
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        name: 'Breads',
        description: 'Freshly baked breads',
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        name: 'Desserts',
        description: 'Sweet desserts and treats',
        status: 'inactive',
        createdBy: adminUser._id,
      },
    ]);

    // Create 5 SubCategories
    console.log('📂 Creating subcategories...');
    const subCategories = await SubCategory.insertMany([
      {
        name: 'Chocolate Cakes',
        category: categories[0]._id,
        description: 'Rich chocolate layered cakes',
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        name: 'Fruit Cakes',
        category: categories[0]._id,
        description: 'Cakes with fresh fruits',
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        name: 'Croissants',
        category: categories[1]._id,
        description: 'Buttery and flaky croissants',
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        name: 'Chocolate Chip Cookies',
        category: categories[2]._id,
        description: 'Classic chocolate chip cookies',
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        name: 'Multigrain Bread',
        category: categories[3]._id,
        description: 'Healthy multigrain bread',
        status: 'active',
        createdBy: adminUser._id,
      },
    ]);

    // Create 5 Products
    console.log('🍰 Creating products...');
    const products = await Product.insertMany([
      {
        name: 'Chocolate Fudge Cake',
        description: 'Rich chocolate cake with fudge frosting',
        category: categories[0]._id,
        subcategory: subCategories[0]._id,
        price: 450,
        discount: 10,
        stock_quantity: 25,
        images: [],
        is_featured: true,
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        name: 'Strawberry Pastry',
        description: 'Fresh strawberry pastry with cream',
        category: categories[1]._id,
        subcategory: subCategories[2]._id,
        price: 80,
        discount: 0,
        stock_quantity: 50,
        images: [],
        is_featured: true,
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        name: 'Butter Croissant',
        description: 'Flaky butter croissant',
        category: categories[1]._id,
        subcategory: subCategories[2]._id,
        price: 60,
        discount: 5,
        stock_quantity: 40,
        images: [],
        is_featured: false,
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        name: 'Chocolate Chip Cookies (Pack of 6)',
        description: 'Freshly baked chocolate chip cookies',
        category: categories[2]._id,
        subcategory: subCategories[3]._id,
        price: 120,
        discount: 15,
        stock_quantity: 8,
        images: [],
        is_featured: false,
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        name: 'Multigrain Bread Loaf',
        description: 'Healthy multigrain bread',
        category: categories[3]._id,
        subcategory: subCategories[4]._id,
        price: 45,
        discount: 0,
        stock_quantity: 30,
        images: [],
        is_featured: false,
        status: 'active',
        createdBy: adminUser._id,
      },
    ]);

    // Create 5 Orders
    console.log('🛒 Creating orders...');
    const orders = await Order.insertMany([
      {
        user: customers[0]._id,
        items: [
          {
            product: products[0]._id,
            quantity: 1,
            price: products[0].price,
          },
        ],
        total_amount: 450,
        status: 'delivered',
        delivery_address: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          zip: '400001',
        },
      },
      {
        user: customers[1]._id,
        items: [
          {
            product: products[1]._id,
            quantity: 3,
            price: products[1].price,
          },
        ],
        total_amount: 240,
        status: 'pending',
        delivery_address: {
          street: '456 Park Ave',
          city: 'Delhi',
          state: 'Delhi',
          zip: '110001',
        },
      },
      {
        user: customers[2]._id,
        items: [
          {
            product: products[2]._id,
            quantity: 5,
            price: products[2].price,
          },
        ],
        total_amount: 300,
        status: 'confirmed',
        delivery_address: {
          street: '789 Lake Rd',
          city: 'Bangalore',
          state: 'Karnataka',
          zip: '560001',
        },
      },
      {
        user: customers[3]._id,
        items: [
          {
            product: products[3]._id,
            quantity: 2,
            price: products[3].price,
          },
        ],
        total_amount: 240,
        status: 'baked',
        delivery_address: {
          street: '321 Hill St',
          city: 'Pune',
          state: 'Maharashtra',
          zip: '411001',
        },
      },
      {
        user: customers[4]._id,
        items: [
          {
            product: products[4]._id,
            quantity: 4,
            price: products[4].price,
          },
        ],
        total_amount: 180,
        status: 'delivered',
        delivery_address: {
          street: '654 Beach Rd',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zip: '600001',
        },
      },
    ]);

    // Create 5 Payments
    console.log('💳 Creating payments...');
    await Payment.insertMany([
      {
        order: orders[0]._id,
        user: customers[0]._id,
        amount: 450,
        payment_method: 'card',
        status: 'completed',
        transaction_id: 'TXN001',
      },
      {
        order: orders[1]._id,
        user: customers[1]._id,
        amount: 240,
        payment_method: 'upi',
        status: 'pending',
        transaction_id: 'TXN002',
      },
      {
        order: orders[2]._id,
        user: customers[2]._id,
        amount: 300,
        payment_method: 'card',
        status: 'completed',
        transaction_id: 'TXN003',
      },
      {
        order: orders[3]._id,
        user: customers[3]._id,
        amount: 240,
        payment_method: 'cash',
        status: 'pending',
        transaction_id: 'TXN004',
      },
      {
        order: orders[4]._id,
        user: customers[4]._id,
        amount: 180,
        payment_method: 'wallet',
        status: 'completed',
        transaction_id: 'TXN005',
      },
    ]);

    // Create 5 Coupons
    console.log('🎟️  Creating coupons...');
    await Coupon.insertMany([
      {
        code: 'WELCOME10',
        discount_type: 'percentage',
        discount_value: 10,
        min_order_value: 200,
        max_discount_amount: 100,
        start_date: new Date(),
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        max_uses: 100,
        used_count: 5,
        is_active: true,
      },
      {
        code: 'SAVE50',
        discount_type: 'flat',
        discount_value: 50,
        min_order_value: 500,
        max_discount_amount: 50,
        start_date: new Date(),
        expiry_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        max_uses: 50,
        used_count: 12,
        is_active: true,
      },
      {
        code: 'FIRSTORDER',
        discount_type: 'percentage',
        discount_value: 15,
        min_order_value: 300,
        max_discount_amount: 150,
        start_date: new Date(),
        expiry_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        max_uses: 200,
        used_count: 45,
        is_active: true,
      },
      {
        code: 'EXPIRED20',
        discount_type: 'percentage',
        discount_value: 20,
        min_order_value: 400,
        max_discount_amount: 200,
        start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        expiry_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        max_uses: 100,
        used_count: 80,
        is_active: false,
      },
      {
        code: 'MEGA25',
        discount_type: 'percentage',
        discount_value: 25,
        min_order_value: 1000,
        max_discount_amount: 300,
        start_date: new Date(),
        expiry_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        max_uses: 75,
        used_count: 20,
        is_active: true,
      },
    ]);

    // Create 5 Banners
    console.log('🎨 Creating banners...');
    await Banner.insertMany([
      {
        title: 'Diwali Special Offer',
        image: 'banner1.jpg',
        link: '/products',
        status: 'active',
        displayOrder: 1,
        createdBy: adminUser._id,
      },
      {
        title: 'New Year Sale',
        image: 'banner2.jpg',
        link: '/products',
        status: 'active',
        displayOrder: 2,
        createdBy: adminUser._id,
      },
      {
        title: 'Fresh Bakery Items',
        image: 'banner3.jpg',
        link: '/categories/cakes',
        status: 'active',
        displayOrder: 3,
        createdBy: adminUser._id,
      },
      {
        title: 'Weekend Special',
        image: 'banner4.jpg',
        link: '/products',
        status: 'inactive',
        displayOrder: 4,
        createdBy: adminUser._id,
      },
      {
        title: 'Buy 1 Get 1 Free',
        image: 'banner5.jpg',
        link: '/offers',
        status: 'active',
        displayOrder: 5,
        createdBy: adminUser._id,
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${customers.length + 1} (1 admin, ${customers.length} customers)`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - SubCategories: ${subCategories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log(`   - Payments: 5`);
    console.log(`   - Coupons: 5`);
    console.log(`   - Banners: 5`);
    console.log('\n🔑 Admin Credentials:');
    console.log('   Email: admin@bakery.com');
    console.log('   Password: admin123');
    console.log('\n👤 Customer Credentials (all):');
    console.log('   Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
