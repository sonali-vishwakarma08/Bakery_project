const Order = require('../../models/orderModel.js');
const Product = require('../../models/productModel.js');
const { createNotificationHelper } = require('./notificationController.js');

// Create a new order → customer only
exports.createOrder = async (req, res) => {
  try {
    const user = req.user._id; // logged-in customer
    const {
      items,
      delivery_address,
      is_custom_cake,
      reference_image,
      shape,
      delivery_date,
      special_instructions,
      coupon,
      discount_amount,
      payment_method,
      payment_status
    } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: 'Order must contain at least one product' });

    // Calculate total_amount dynamically
    let total_amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
      
      // Use provided price or calculate from product
      const itemPrice = item.price || product.price;
      total_amount += itemPrice * (item.quantity || 1);
      
      // Ensure item has required fields
      item.price = itemPrice;
      item.quantity = item.quantity || 1;
      item.flavor = item.flavor || null;
      item.weight = item.weight || null;
      item.custom_message = item.custom_message || '';
    }

    // Calculate final amount after discount
    const discount = discount_amount || 0;
    const final_amount = total_amount - discount;

    const order = new Order({
      user,
      items,
      is_custom_cake: is_custom_cake || false,
      reference_image: reference_image || null,
      shape: shape || null,
      delivery_date: delivery_date || null,
      special_instructions: special_instructions || '',
      total_amount,
      discount_amount: discount,
      final_amount,
      coupon: coupon || null,
      payment_status: payment_status || 'pending',
      payment_method: payment_method || 'cod',
      status: 'pending',
      delivery_address: delivery_address || {}
    });

    const savedOrder = await order.save();
    
    // Create notification for the user
    await createNotificationHelper(
      user,
      'Order Placed Successfully',
      `Your order ${savedOrder.order_code} has been placed successfully. Total: ₹${final_amount}`,
      'order'
    );
    
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price images')
      .populate('coupon', 'code discount_value');
    
    res.status(201).json(populatedOrder);

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
      .populate('items.product', 'name price images')
      .populate('coupon', 'code discount_value discount_type')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get orders for logged-in customer
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name price images')
      .populate('coupon', 'code discount_value discount_type')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single order by ID → Admin or owner customer
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params || req.body; // support both params and body
    if (!id) return res.status(400).json({ message: 'Order ID is required' });

    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price images')
      .populate('coupon', 'code discount_value discount_type');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only allow access if admin or the customer who placed it
    if (req.user && req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
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
    const { id, status, payment_status, payment_method } = req.body; // using POST body
    if (!id) return res.status(400).json({ message: 'Order ID is required' });

    const updateData = {};
    if (status) updateData.status = status;
    if (payment_status) updateData.payment_status = payment_status;
    if (payment_method) updateData.payment_method = payment_method;

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true })
      .populate('user', 'name email phone')
      .populate('items.product', 'name price images')
      .populate('coupon', 'code discount_value');
    
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    // Create notification for status update
    const statusMessages = {
      'pending': 'Your order is pending confirmation',
      'confirmed': 'Your order has been confirmed',
      'baking': 'Your order is being prepared',
      'packed': 'Your order has been packed',
      'out_for_delivery': 'Your order is out for delivery',
      'delivered': 'Your order has been delivered',
      'cancelled': 'Your order has been cancelled'
    };
    
    if (updatedOrder.user && status) {
      await createNotificationHelper(
        updatedOrder.user._id,
        'Order Status Updated',
        `Order ${updatedOrder.order_code}: ${statusMessages[status] || 'Status updated'}`,
        'order'
      );
    }

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
