const Payment = require('../models/paymentModel.js');

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('order', 'total_amount status')
      .sort({ createdAt: -1 })
      .lean();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single payment by ID (POST)
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Payment ID is required.' });

    const payment = await Payment.findById(id)
      .populate('user', 'name email')
      .populate('order', 'total_amount status')
      .lean();
    if (!payment) return res.status(404).json({ message: 'Payment not found.' });

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update payment (POST)
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Payment ID is required.' });

    const updatedPayment = await Payment.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPayment) return res.status(404).json({ message: 'Payment not found.' });

    res.json(updatedPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete payment (POST)
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Payment ID is required.' });

    const deletedPayment = await Payment.findByIdAndDelete(id);
    if (!deletedPayment) return res.status(404).json({ message: 'Payment not found.' });

    res.json({ message: 'Payment deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
