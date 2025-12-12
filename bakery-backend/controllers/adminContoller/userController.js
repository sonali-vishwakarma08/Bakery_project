const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');

// ===== Create User =====
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, savedAddresses, role, accountStatus } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if phone already exists
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({ message: 'User with this phone already exists' });
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      passwordHash,
      phone,
      address: address || {},
      savedAddresses: savedAddresses || [],
      role: role || 'customer',
      accountStatus: accountStatus || 'active',
      auth_provider: 'local',
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        savedAddresses: newUser.savedAddresses,
        role: newUser.role,
        accountStatus: newUser.accountStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== Get All Users =====
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.body; // Optional filter by role
    const filter = role ? { role } : {};
    const skip = (page - 1) * limit;
    
    const users = await User.find(filter)
      .select('-passwordHash -otp -otp_expiry')
      .skip(skip)
      .limit(parseInt(limit));
      
    // Get total count for pagination
    const total = await User.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      users: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
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
    const { id, name, email, phone, address, savedAddresses, profile_image, accountStatus } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (savedAddresses && Array.isArray(savedAddresses)) user.savedAddresses = savedAddresses;
    if (profile_image) user.profile_image = profile_image;
    if (accountStatus) user.accountStatus = accountStatus;

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        savedAddresses: user.savedAddresses,
        profile_image: user.profile_image,
        role: user.role,
        accountStatus: user.accountStatus,
        auth_provider: user.auth_provider,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
