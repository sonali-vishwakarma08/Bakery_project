const Product = require("../../models/productModel");
const path = require("path");

// Get all products with search and filtering
exports.getProducts = async (req, res) => {
  try {
    const { category, status, featured, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    let searchQuery = {};

    // Build filter
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured !== undefined)
      filter.is_featured = featured === true || featured === "true";

    // Build search query
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Combine filter and search
    const finalFilter = { ...filter, ...searchQuery };

    // Calculate pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(finalFilter)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);

    const total = await Product.countDocuments(finalFilter);

    res.json({
      products,
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

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ 
      status: "active" 
    })
      .populate("category", "name")
      .sort({ ratingAvg: -1, createdAt: -1 })
      .limit(limit * 1);

    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Product ID is required" });

    const product = await Product.findById(id)
      .populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Create product with image upload
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discount,
      stock_quantity,
      images,
      weight_options,
      flavors,
      preparation_time,
      is_custom_message_allowed,
      custom_message_max_length,
      status,
    } = req.body;

    // Handle image upload - can be single file or array
    let productImages = [];
    if (req.file) {
      productImages = [req.file.filename];
    } else if (req.files && req.files.length > 0) {
      productImages = req.files.map(file => file.filename);
    } else if (images && Array.isArray(images)) {
      productImages = images;
    }

    const productData = {
      name,
      description: description || '',
      category,
      price,
      discount: discount || 0,
      stock_quantity: stock_quantity || 0,
      images: productImages,
      weight_options: weight_options || [],
      flavors: flavors || [],
      preparation_time: preparation_time || 30,
      is_custom_message_allowed: is_custom_message_allowed === true || is_custom_message_allowed === "true",
      custom_message_max_length: custom_message_max_length || 40,
      status: status || "active",
    };

    const newProduct = new Product(productData);

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(400).json({ message: err.message });
  }
};

// ✅ Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    if (!id) return res.status(400).json({ message: "Product ID required" });

    // Handle image upload - can be single file or array
    if (req.file) {
      updateData.images = [req.file.filename];
    } else if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.filename);
    }

    // Handle boolean conversions
    if (updateData.is_custom_message_allowed !== undefined) {
      updateData.is_custom_message_allowed = updateData.is_custom_message_allowed === true || updateData.is_custom_message_allowed === "true";
    }

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("category", "name");
    
    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Product ID required" });

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
