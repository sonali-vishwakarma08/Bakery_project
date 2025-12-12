const Review = require("../../models/reviewModel");

// 🟢 Create Review or Feedback
exports.createReview = async (req, res) => {
  try {
    const { 
      user, 
      product, 
      order,
      type, 
      rating,
      quality_rating,
      taste_rating,
      packaging_rating,
      comment,
      images
    } = req.body;

    if (!user || !comment) {
      return res.status(400).json({ message: "User and comment are required." });
    }

    if (type === "review" && (!product || !rating)) {
      return res.status(400).json({ message: "Product and rating are required for reviews." });
    }

    const review = new Review({
      user,
      product,
      order: order || null,
      type,
      rating,
      quality_rating: quality_rating || null,
      taste_rating: taste_rating || null,
      packaging_rating: packaging_rating || null,
      comment,
      images: images || [],
      is_verified_purchase: order ? true : false,
      status: 'pending'
    });
    
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🟢 Get all Reviews / Feedback
exports.getReviews = async (req, res) => {
  try {
    const { type } = req.body; // optional filter
    const filter = type ? { type } : {};

    const reviews = await Review.find(filter)
      .populate("user", "name email")
      .populate("product", "name price")
      .sort({ createdAt: -1 })
      .lean();

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get Review / Feedback by ID
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Review ID is required." });

    const review = await Review.findById(id)
      .populate("user", "name email")
      .populate("product", "name price")
      .lean();

    if (!review) return res.status(404).json({ message: "Review not found." });

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Update Review / Feedback (Admin can reply)
exports.updateReview = async (req, res) => {
  try {
    const { id, reply, comment, rating } = req.body;
    if (!id) return res.status(400).json({ message: "Review ID is required." });

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (reply) review.reply = reply; // admin response
    if (comment) review.comment = comment; // user edit
    if (rating) review.rating = rating;

    const updated = await review.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🟢 Delete Review / Feedback
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Review ID is required." });

    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Review not found." });

    res.json({ message: "Review deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve or reject review
exports.approveReview = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) return res.status(400).json({ message: "Review ID and status are required." });

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be pending, approved, or rejected." });
    }

    const review = await Review.findByIdAndUpdate(id, { status }, { new: true })
      .populate("user", "name email")
      .populate("product", "name price");

    if (!review) return res.status(404).json({ message: "Review not found." });

    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mark review as helpful/not helpful
exports.markHelpful = async (req, res) => {
  try {
    const { id, helpful } = req.body;
    if (!id || helpful === undefined) return res.status(400).json({ message: "Review ID and helpful flag are required." });

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (helpful) {
      review.helpful_votes += 1;
    } else {
      review.not_helpful_votes += 1;
    }

    const updated = await review.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get approved reviews for a product
exports.getApprovedReviews = async (req, res) => {
  try {
    const { productId, limit = 10, page = 1 } = req.query;
    const filter = { status: 'approved' };
    if (productId) filter.product = productId;

    const skip = (page - 1) * limit;
    const reviews = await Review.find(filter)
      .populate("user", "name email")
      .populate("product", "name price")
      .sort({ helpful_votes: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
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
