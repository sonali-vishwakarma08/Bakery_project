const AdminLog = require('../../models/adminLogModel');

// Get all admin logs
exports.getAdminLogs = async (req, res) => {
  try {
    const { admin, action, startDate, endDate, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (admin) filter.admin = admin;
    if (action) filter.action = { $regex: action, $options: 'i' };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const logs = await AdminLog.find(filter)
      .populate('admin', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);

    const total = await AdminLog.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single admin log by ID
exports.getAdminLogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Admin log ID is required' });

    const log = await AdminLog.findById(id).populate('admin', 'name email role');
    if (!log) return res.status(404).json({ message: 'Admin log not found' });

    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create admin log (helper function - usually called by other controllers)
exports.createAdminLog = async (req, res) => {
  try {
    const { action, details } = req.body;
    const admin = req.user?._id;

    if (!admin || !action) {
      return res.status(400).json({ message: 'Admin ID and action are required' });
    }

    const logData = {
      admin,
      action,
      details: details || {},
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    };

    const log = new AdminLog(logData);
    const savedLog = await log.save();

    const populatedLog = await AdminLog.findById(savedLog._id)
      .populate('admin', 'name email role');

    res.status(201).json(populatedLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Helper function to create log (can be used by other controllers)
exports.createLogHelper = async (adminId, action, details = {}, ip = null) => {
  try {
    const log = new AdminLog({
      admin: adminId,
      action,
      details,
      ip
    });
    await log.save();
    return log;
  } catch (err) {
    console.error('Error creating admin log:', err);
    return null;
  }
};

// Delete admin log (Admin only)
exports.deleteAdminLog = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Admin log ID is required' });

    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const deletedLog = await AdminLog.findByIdAndDelete(id);
    if (!deletedLog) return res.status(404).json({ message: 'Admin log not found' });

    res.json({ message: 'Admin log deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

