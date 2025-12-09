const Inventory = require('../../models/inventoryModel.js');
const mongoose = require('mongoose');

// 🟢 Add new inventory item
exports.addInventory = async (req, res) => {
  try {
    const { name, quantity_available = 0, unit } = req.body;

    if (!name || !unit) {
      return res.status(400).json({ message: 'Name and unit are required.' });
    }

    if (!['kg', 'ltr', 'pcs'].includes(unit)) {
      return res.status(400).json({ message: 'Unit must be one of: kg, ltr, pcs' });
    }

    const newInventory = new Inventory({
      name,
      quantity_available: Number(quantity_available),
      unit
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

// 🟣 Restock inventory (POST)
exports.restockInventory = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    if (!id || !mongoose.Types.ObjectId.isValid(id) || quantity === undefined) {
      return res.status(400).json({ message: 'Valid Inventory ID and quantity are required.' });
    }

    const item = await Inventory.findById(id);
    if (!item) return res.status(404).json({ message: 'Inventory item not found.' });

    item.quantity_available += Number(quantity);
    const updated = await item.save();

    res.json({
      message: `Added ${quantity} ${item.unit} to ${item.name}.`,
      updated
    });
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
