const Product = require("../../models/productModel");
const path = require("path");

// ✅ Get all products
exports.getProducts = async (req, res) => {
  try {
    const { category, status, featured } = req.body || {};
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured !== undefined)
      filter.is_featured = featured === true || featured === "true";

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("subcategory", "name")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Product ID is required" });

    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("subcategory", "name");
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
      stock,
      stock_quantity,
      is_featured,
      status,
    } = req.body;

    // Handle single image upload - save only filename
    const imageFilename = req.file ? req.file.filename : null;

    const productData = {
      name,
      description,
      category,
      price,
      discount: discount || 0,
      stock_quantity: stock_quantity || stock || 0,
      is_featured: is_featured === true || is_featured === "true",
      status: status || "active",
      images: imageFilename ? [imageFilename] : [],
    };
    
    // Only add createdBy if user exists
    if (req.user?._id) {
      productData.createdBy = req.user._id;
    }

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
    const { id, stock, stock_quantity, is_featured } = req.body;
    if (!id) return res.status(400).json({ message: "Product ID required" });

    let updateData = { ...req.body };
    
    // Handle stock field mapping
    if (stock !== undefined && stock_quantity === undefined) {
      updateData.stock_quantity = stock;
      delete updateData.stock;
    }
    
    // Handle boolean conversion for is_featured
    if (is_featured !== undefined) {
      updateData.is_featured = is_featured === true || is_featured === "true";
    }

    // Handle single image upload - save only filename
    if (req.file) {
      updateData.images = [req.file.filename];
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("category", "name")
      .populate("subcategory", "name");
    
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
