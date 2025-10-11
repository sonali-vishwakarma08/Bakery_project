const Banner = require('../models/bannerModel');

// Get all banners
exports.getBanners = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const banners = await Banner.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Banner ID is required' });

    const banner = await Banner.findById(id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create banner
exports.createBanner = async (req, res) => {
  try {
    const bannerData = { ...req.body, createdBy: req.user?._id };
    
    // Handle image upload - save only filename
    if (req.file) {
      bannerData.image = req.file.filename;
    }
    
    const banner = new Banner(bannerData);
    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update banner
exports.updateBanner = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    if (!id) return res.status(400).json({ message: 'Banner ID is required' });

    // Handle image upload - save only filename
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBanner) return res.status(404).json({ message: 'Banner not found' });

    res.json(updatedBanner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete banner
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Banner ID is required' });

    const deletedBanner = await Banner.findByIdAndDelete(id);
    if (!deletedBanner) return res.status(404).json({ message: 'Banner not found' });

    res.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
