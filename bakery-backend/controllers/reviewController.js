const Review = require("../../models/reviewModel");

// 🟢 Create Review or Feedback
exports.createReview = async (req, res) => {
  try {
    const { user, product, type, rating, comment } = req.body;

    if (!user || !comment) {
      return res.status(400).json({ message: "User and comment are required." });
    }

    if (type === "review" && (!product || !rating)) {
      return res.status(400).json({ message: "Product and rating are required for reviews." });
    }

    const review = new Review(req.body);
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
