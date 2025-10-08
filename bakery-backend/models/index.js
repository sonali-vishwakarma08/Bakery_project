const User = require('./userModel');
const Product = require('./productModel');
const Order = require('./orderModel');
const Inventory = require('./inventoryModel');
const Review = require('./reviewModel');
const VerificationToken = require('./verificationTokenModel');
const Coupon = require('./couponModel');
const Payment = require('./paymentModel');
const Notification = require('./notificationModel');

module.exports = {
  User,
  Product,
  Order,
  Inventory,
  Review,
  VerificationToken,
  Coupon,
  Payment,
  Notification
};