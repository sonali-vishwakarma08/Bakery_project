const Delivery = require('../../models/deliveryModel.js');

// Create new delivery record
exports.createDelivery = async (req, res) => {
  try {
    const { order, status, rider_name, rider_phone } = req.body;
    if (!order) {
      return res.status(400).json({ message: 'Order ID is required.' });
    }

    const deliveryData = {
      order,
      status: status || 'pending',
      rider_name: rider_name || null,
      rider_phone: rider_phone || null,
      status_history: [{ status: status || 'pending', time: new Date() }]
    };

    const delivery = new Delivery(deliveryData);
    const savedDelivery = await delivery.save();
    
    const populatedDelivery = await Delivery.findById(savedDelivery._id)
      .populate('order', 'order_code user total_amount status');
    
    res.status(201).json(populatedDelivery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all deliveries
exports.getDeliveries = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const deliveries = await Delivery.find(filter)
      .populate('order', 'order_code user total_amount status delivery_address')
      .sort({ createdAt: -1 })
      .lean();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single delivery by ID (POST)
exports.getDeliveryById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Delivery ID is required.' });

    const delivery = await Delivery.findById(id)
      .populate('order', 'order_code user total_amount status delivery_address')
      .lean();
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update delivery status / info (POST)
exports.updateDelivery = async (req, res) => {
  try {
    const { id, status, rider_name, rider_phone } = req.body;
    if (!id) return res.status(400).json({ message: 'Delivery ID is required.' });

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Track status change in history
    if (status && status !== delivery.status) {
      delivery.status_history.push({ 
        status, 
        time: new Date() 
      });
      delivery.status = status;
    }

    // Update rider info if provided
    if (rider_name !== undefined) delivery.rider_name = rider_name;
    if (rider_phone !== undefined) delivery.rider_phone = rider_phone;

    const updated = await delivery.save();
    
    const populatedDelivery = await Delivery.findById(updated._id)
      .populate('order', 'order_code user total_amount status delivery_address');
    
    res.json(populatedDelivery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete delivery (POST)
exports.deleteDelivery = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Delivery ID is required.' });

    const deleted = await Delivery.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    res.json({ message: 'Delivery deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};