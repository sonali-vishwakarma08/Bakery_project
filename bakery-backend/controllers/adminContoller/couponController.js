const Coupon = require('../../models/couponModel');

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    const savedCoupon = await coupon.save();
    res.status(201).json(savedCoupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a coupon
exports.updateCoupon = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    if (!id) return res.status(400).json({ message: 'Coupon ID is required' });

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCoupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(updatedCoupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Coupon ID is required' });

    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all coupons (for admin)
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single coupon by ID
exports.getCouponById = async (req, res) => {
  try {
    const { id } = req.params || req.body;
    if (!id) return res.status(400).json({ message: 'Coupon ID is required' });

    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
