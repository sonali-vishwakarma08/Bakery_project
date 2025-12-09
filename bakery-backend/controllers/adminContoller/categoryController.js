const Category = require('../../models/categoryModel');

// 🟢 Get all categories
exports.getCategories = async (req, res) => {
  try {
    const { status } = req.query; // ✅ changed from req.body → req.query
    const filter = {};
    if (status) filter.status = status;

    const categories = await Category.find(filter).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params; // ✅ changed from req.body → req.params
    if (!id) return res.status(400).json({ message: 'Category ID is required' });

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟡 Create category (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const categoryData = { ...req.body, createdBy: req.user?._id };
    
    // Handle image upload - save only filename
    if (req.file) {
      categoryData.image = req.file.filename;
    }
    
    const category = new Category(categoryData);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🟠 Update category (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    if (!id) return res.status(400).json({ message: 'Category ID is required' });

    // Handle image upload
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });

    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔴 Delete category (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Category ID is required' });

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
