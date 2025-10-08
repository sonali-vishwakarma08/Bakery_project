const User = require('./userModel');
const Product = require('./productModel');
const Order = require('./orderModel');
const Inventory = require('./inventoryModel');
const Review = require('./reviewModel');
const Coupon = require('./couponModel');
const Payment = require('./paymentModel');
const Notification = require('./notificationModel');
const Wishlist=require('./wishlistModel')
const Cart=require('./cartModel');
const Category=require('./categoryModel');
const DeliveryStaff=require('./deliveryStaffModel')

module.exports = {
  User,
  Product,
  Order,
  Inventory,
  Review,
  Coupon,
  Payment,
  Notification,
  Wishlist,
  Cart,
  Category,
  DeliveryStaff
};