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

// Validate coupon code (for customer use)
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Check if coupon is valid
    const now = new Date();
    if (coupon.status !== 'active') {
      return res.status(400).json({ message: 'Coupon is not active' });
    }

    if (now < coupon.start_date) {
      return res.status(400).json({ message: 'Coupon is not yet valid' });
    }

    if (now > coupon.expiry_date) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    if (orderAmount && orderAmount < coupon.min_order_amount) {
      return res.status(400).json({ 
        message: `Minimum order amount ${coupon.min_order_amount} required for this coupon` 
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (orderAmount * coupon.discount_value) / 100;
      if (coupon.max_discount_amount > 0) {
        discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    res.json({
      message: 'Coupon is valid',
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discountAmount
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get active coupons for customers
exports.getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      status: 'active',
      start_date: { $lte: now },
      expiry_date: { $gte: now }
    }).sort({ createdAt: -1 });

    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
