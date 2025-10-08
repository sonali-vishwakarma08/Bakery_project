const Product = require('../../models/productModel.js');

// Get all products (filters sent in body)
exports.getProducts = async (req, res) => {
  try {
    const { category, status, featured } = req.body;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured !== undefined) filter.is_featured = featured === true || featured === 'true';

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product by ID (send { id: "<productId>" } in body)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Product ID is required' });

    const product = await Product.findById(id).populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({ ...req.body, createdBy: req.user?._id });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update product by ID (send { id: "<productId>", ...updateFields })
exports.updateProduct = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    if (!id) return res.status(400).json({ message: 'Product ID is required' });

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete product by ID (send { id: "<productId>" })
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Product ID is required' });

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
