const Inventory = require('../../models/inventoryModel.js');

// 🟢 Add new inventory item
exports.addInventory = async (req, res) => {
  try {
    const { name, quantity_available, unit, category, low_stock_threshold } = req.body;

    if (!name || !unit) {
      return res.status(400).json({ message: 'Name and unit are required.' });
    }

    const newInventory = new Inventory({
      name,
      quantity_available,
      unit,
      category,
      low_stock_threshold
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
    const inventories = await Inventory.find().populate('category', 'name').lean();
    res.json(inventories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟠 Get single inventory item by ID (POST)
exports.getInventoryById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Inventory ID is required.' });

    const item = await Inventory.findById(id).populate('category', 'name').lean();
    if (!item) return res.status(404).json({ message: 'Inventory item not found.' });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔵 Update inventory (POST)
exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Inventory ID is required.' });

    const updated = await Inventory.findByIdAndUpdate(id, req.body, { new: true });
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
    if (!id || quantity === undefined)
      return res.status(400).json({ message: 'Inventory ID and quantity are required.' });

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
    if (!id) return res.status(400).json({ message: 'Inventory ID is required.' });

    const deleted = await Inventory.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Inventory item not found.' });

    res.json({ message: 'Inventory item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
