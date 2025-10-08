const Delivery = require('../../models/deliveryModel.js');

// Create new delivery record
exports.createDelivery = async (req, res) => {
  try {
    const { order, provider } = req.body;
    if (!order || !provider) {
      return res.status(400).json({ message: 'Order and provider are required.' });
    }

    const delivery = new Delivery(req.body);
    const savedDelivery = await delivery.save();
    res.status(201).json(savedDelivery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all deliveries
exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate('order', 'user total_amount status')
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
      .populate('order', 'user total_amount status')
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
    const { id, status } = req.body;
    if (!id) return res.status(400).json({ message: 'Delivery ID is required.' });

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Track status change
    if (status && status !== delivery.status) {
      delivery.status_history.push({ status, updated_at: new Date() });
    }

    Object.assign(delivery, req.body);
    const updated = await delivery.save();
    res.json(updated);
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