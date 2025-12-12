const Inventory = require('../../models/inventoryModel.js');
const mongoose = require('mongoose');

// 🟢 Add new inventory item
exports.addInventory = async (req, res) => {
  try {
    const { 
      name, 
      quantity_available = 0, 
      unit,
      min_stock_level,
      cost_per_unit,
      supplier,
      supplier_contact,
      expiry_date,
      category
    } = req.body;

    if (!name || !unit) {
      return res.status(400).json({ message: 'Name and unit are required.' });
    }

    if (!['kg', 'ltr', 'pcs', 'g', 'ml'].includes(unit)) {
      return res.status(400).json({ message: 'Unit must be one of: kg, ltr, pcs, g, ml' });
    }

    const newInventory = new Inventory({
      name,
      quantity_available: Number(quantity_available),
      unit,
      min_stock_level: min_stock_level || 5,
      cost_per_unit: cost_per_unit || 0,
      supplier: supplier || '',
      supplier_contact: supplier_contact || '',
      expiry_date: expiry_date || null,
      category: category || 'other',
      status: quantity_available > 0 ? 'available' : 'out_of_stock'
    });

    const savedItem = await newInventory.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟡 Get all inventory items
exports.getInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find().sort({ createdAt: -1 }).lean();
    res.json(inventories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟠 Get single inventory item by ID (POST)
exports.getInventoryById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Valid Inventory ID is required.' });
    }

    const item = await Inventory.findById(id).lean();
    if (!item) return res.status(404).json({ message: 'Inventory item not found.' });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔵 Update inventory (POST)
exports.updateInventory = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Valid Inventory ID is required.' });
    }

    // Prevent updating _id
    delete updateData._id;

    const updated = await Inventory.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Inventory item not found.' });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🟣 Get low stock items
exports.getLowStockItems = async (req, res) => {
  try {
    const items = await Inventory.find({ status: 'low_stock' }).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟣 Check expiry items
exports.getExpiryItems = async (req, res) => {
  try {
    const today = new Date();
    const items = await Inventory.find({ 
      expiry_date: { $lte: today },
      status: { $ne: 'expired' }
    }).sort({ expiry_date: 1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔴 Delete inventory (POST)
exports.deleteInventory = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Valid Inventory ID is required.' });
    }

    const deleted = await Inventory.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Inventory item not found.' });

    res.json({ message: 'Inventory item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get inventory by category
exports.getInventoryByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const items = await Inventory.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
