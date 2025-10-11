const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Payment = require('../models/paymentModel');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Count total products
    const totalProducts = await Product.countDocuments();

    // Count total users (customers only)
    const totalUsers = await User.countDocuments({ role: 'customer' });

    // Count total orders
    const totalSales = await Order.countDocuments();

    // Calculate total income from completed orders
    const completedOrders = await Order.find({ status: 'delivered' });
    const totalIncome = completedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

    res.json({
      totalProducts,
      totalUsers,
      totalSales,
      totalIncome: Math.round(totalIncome * 100) / 100, // Round to 2 decimal places
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get best-selling products
exports.getBestSellers = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    // Aggregate orders to find best-selling products
    const bestSellers = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSales: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $project: {
          _id: '$productDetails._id',
          name: '$productDetails.name',
          image: { $arrayElemAt: ['$productDetails.images', 0] },
          sales: '$totalSales',
          revenue: '$totalRevenue',
          rating: 4.5, // You can add rating field to product model later
          progress: { $multiply: [{ $divide: ['$totalSales', 100] }, 100] } // Calculate progress percentage
        }
      }
    ]);

    res.json(bestSellers);
  } catch (err) {
    console.error('Best sellers error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get recent orders
exports.getRecentOrders = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const formattedOrders = recentOrders.map(order => ({
      id: order._id,
      customer: order.user?.name || 'Guest',
      item: order.items[0]?.product?.name || 'N/A',
      total: `₹${order.total_amount?.toFixed(2) || '0.00'}`,
      image: order.items[0]?.product?.images?.[0] || '',
      status: order.status || 'pending',
    }));

    res.json(formattedOrders);
  } catch (err) {
    console.error('Recent orders error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get recent activity
exports.getRecentActivity = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const activities = [];

    // Get recent users
    const recentUsers = await User.find({ role: 'customer' })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name createdAt');

    recentUsers.forEach(user => {
      activities.push({
        type: 'user',
        message: `New user registered - ${user.name}`,
        time: getTimeAgo(user.createdAt),
        timestamp: user.createdAt,
      });
    });

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('_id status createdAt');

    recentOrders.forEach(order => {
      const message = order.status === 'delivered' 
        ? `Order #${order._id.toString().slice(-6)} marked as delivered`
        : `New order placed - Order #${order._id.toString().slice(-6)}`;
      
      activities.push({
        type: 'order',
        message,
        time: getTimeAgo(order.createdAt),
        timestamp: order.createdAt,
      });
    });

    // Get recent products
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select('name createdAt');

    recentProducts.forEach(product => {
      activities.push({
        type: 'product',
        message: `New product added - ${product.name}`,
        time: getTimeAgo(product.createdAt),
        timestamp: product.createdAt,
      });
    });

    // Get recent payments
    const recentPayments = await Payment.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(2)
      .select('amount createdAt');

    recentPayments.forEach(payment => {
      activities.push({
        type: 'income',
        message: `Received payment - ₹${payment.amount?.toFixed(2)}`,
        time: getTimeAgo(payment.createdAt),
        timestamp: payment.createdAt,
      });
    });

    // Sort all activities by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedActivities = activities.slice(0, parseInt(limit));

    // Remove timestamp before sending
    const formattedActivities = limitedActivities.map(({ timestamp, ...activity }) => activity);

    res.json(formattedActivities);
  } catch (err) {
    console.error('Recent activity error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get sales chart data (last 6 months)
exports.getSalesChart = async (req, res) => {
  try {
    const monthsAgo = 6;
    const salesByMonth = [];
    const labels = [];
    
    // Get current date
    const now = new Date();
    
    // Calculate sales for each of the last 6 months
    for (let i = monthsAgo - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      // Get all orders for the month (not just delivered)
      const orders = await Order.find({
        createdAt: { $gte: startDate, $lte: endDate }
      });
      
      const totalSales = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      salesByMonth.push(Math.round(totalSales));
      
      // Format month label
      labels.push(startDate.toLocaleString('default', { month: 'short' }));
    }
    
    // If no data, provide sample data to show the chart works
    const hasData = salesByMonth.some(val => val > 0);
    
    res.json({
      labels,
      datasets: [{
        label: 'Monthly Sales (₹)',
        data: hasData ? salesByMonth : [0, 0, 0, 0, 0, 0],
        backgroundColor: '#f472b6',
        borderRadius: 6,
      }]
    });
  } catch (err) {
    console.error('Sales chart error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get category distribution chart data
exports.getCategoryChart = async (req, res) => {
  try {
    const Category = require('../models/categoryModel');
    
    // Get all categories with product counts
    const categories = await Category.find({ status: 'active' });
    const categoryData = [];
    const labels = [];
    
    for (const category of categories) {
      const count = await Product.countDocuments({ category: category._id });
      if (count > 0) {
        labels.push(category.name);
        categoryData.push(count);
      }
    }
    
    // If no categories, provide default data
    if (labels.length === 0) {
      labels.push('No Categories');
      categoryData.push(1);
    }
    
    res.json({
      labels,
      datasets: [{
        label: 'Product Categories',
        data: categoryData,
        backgroundColor: ['#f472b6', '#fb923c', '#34d399', '#60a5fa', '#a78bfa', '#f87171'],
        borderWidth: 1,
      }]
    });
  } catch (err) {
    console.error('Category chart error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get customer growth chart data (last 6 months)
exports.getCustomerGrowthChart = async (req, res) => {
  try {
    const monthsAgo = 6;
    const customersByMonth = [];
    const labels = [];
    
    const now = new Date();
    
    for (let i = monthsAgo - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const newCustomers = await User.countDocuments({
        role: 'customer',
        createdAt: { $gte: startDate, $lte: endDate }
      });
      
      customersByMonth.push(newCustomers);
      labels.push(startDate.toLocaleString('default', { month: 'short' }));
    }
    
    res.json({
      labels,
      datasets: [{
        label: 'New Customers',
        data: customersByMonth,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        tension: 0.4,
        fill: true,
      }]
    });
  } catch (err) {
    console.error('Customer growth chart error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return `${seconds} secs ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
  return `${Math.floor(seconds / 2592000)} months ago`;
}
