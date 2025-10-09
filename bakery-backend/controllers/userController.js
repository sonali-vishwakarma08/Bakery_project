const User = require('../models/userModel');

// ===== Get All Users =====
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash -otp -otp_expiry');
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== Get Single User =====
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id).select('-passwordHash -otp -otp_expiry');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== Delete User =====
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== Update User =====
exports.updateUser = async (req, res) => {
  try {
    const { id, name, phone, address, profile_image } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (profile_image) user.profile_image = profile_image;

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profile_image: user.profile_image,
        role: user.role,
        auth_provider: user.auth_provider,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
