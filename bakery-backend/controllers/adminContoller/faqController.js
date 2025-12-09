const FAQ = require('../../models/faqModel');

// Get all FAQs
exports.getFAQs = async (req, res) => {
  try {
    const { category, status, is_featured } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (is_featured !== undefined) filter.is_featured = is_featured === true || is_featured === 'true';

    const faqs = await FAQ.find(filter)
      .populate('createdBy', 'name email')
      .sort({ sort_order: 1, createdAt: -1 });

    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single FAQ by ID
exports.getFAQById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'FAQ ID is required' });

    const faq = await FAQ.findById(id).populate('createdBy', 'name email');
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create FAQ
exports.createFAQ = async (req, res) => {
  try {
    const faqData = {
      ...req.body,
      createdBy: req.user?._id || null
    };

    const faq = new FAQ(faqData);
    const savedFAQ = await faq.save();
    res.status(201).json(savedFAQ);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    if (!id) return res.status(400).json({ message: 'FAQ ID is required' });

    const updatedFAQ = await FAQ.findByIdAndUpdate(id, updateData, { new: true })
      .populate('createdBy', 'name email');
    
    if (!updatedFAQ) return res.status(404).json({ message: 'FAQ not found' });

    res.json(updatedFAQ);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'FAQ ID is required' });

    const deletedFAQ = await FAQ.findByIdAndDelete(id);
    if (!deletedFAQ) return res.status(404).json({ message: 'FAQ not found' });

    res.json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

