const Order = require('../models/orderModel.js');
const Product = require('../models/productModel.js');

// Create a new order → customer only
exports.createOrder = async (req, res) => {
  try {
    const user = req.user._id; // logged-in customer
    const {
      items,
      delivery_address,
      expected_delivery_time,
      notes,
      isGift,
      giftMessage,
      coupon,
      delivery_staff,
      order_source,
      delivery_fee,
      discount_amount
    } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: 'Order must contain at least one product' });

    // Calculate total_amount dynamically
    let total_amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
      total_amount += product.price * item.quantity;
      item.price = product.price; // store price at purchase time
    }

    total_amount = total_amount + (delivery_fee || 0) - (discount_amount || 0);

    const order = new Order({
      user,
      items,
      total_amount,
      delivery_address,
      expected_delivery_time,
      notes,
      isGift,
      giftMessage,
      coupon,
      delivery_staff,
      order_source,
      delivery_fee,
      discount_amount
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all orders → Admin only
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.product', 'name price')
      .populate('coupon', 'code discount_value')
      .populate('delivery_staff', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single order by ID → Admin or owner customer
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.body; // using POST body
    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price')
      .populate('coupon', 'code discount_value')
      .populate('delivery_staff', 'name phone');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only allow access if admin or the customer who placed it
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status → Admin only
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id, status } = req.body; // using POST body

    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete order → Admin only
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.body; // using POST body
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
