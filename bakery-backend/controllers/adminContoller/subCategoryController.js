const SubCategory = require('../../models/subCategoryModel');

// Get all subcategories
exports.getSubCategories = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const subCategories = await SubCategory.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single subcategory by ID
exports.getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'SubCategory ID is required' });

    const subCategory = await SubCategory.findById(id).populate('category', 'name');
    if (!subCategory) return res.status(404).json({ message: 'SubCategory not found' });

    res.json(subCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create subcategory
exports.createSubCategory = async (req, res) => {
  try {
    const subCategoryData = { ...req.body, createdBy: req.user?._id };
    
    // Handle image upload - save only filename
    if (req.file) {
      subCategoryData.image = req.file.filename;
    }
    
    const subCategory = new SubCategory(subCategoryData);
    const savedSubCategory = await subCategory.save();
    res.status(201).json(savedSubCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update subcategory
exports.updateSubCategory = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    if (!id) return res.status(400).json({ message: 'SubCategory ID is required' });

    // Handle image upload - save only filename
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, updateData, { new: true })
      .populate('category', 'name');
    if (!updatedSubCategory) return res.status(404).json({ message: 'SubCategory not found' });

    res.json(updatedSubCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete subcategory
exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'SubCategory ID is required' });

    const deletedSubCategory = await SubCategory.findByIdAndDelete(id);
    if (!deletedSubCategory) return res.status(404).json({ message: 'SubCategory not found' });

    res.json({ message: 'SubCategory deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
