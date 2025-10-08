const express = require("express");
const router = express.Router();
const reviewController = require("../../controllers/reviewController");

// All POST-based routes
router.post("/create", reviewController.createReview);
router.post("/getAll", reviewController.getReviews);
router.post("/getById", reviewController.getReviewById);
router.post("/update", reviewController.updateReview);
router.post("/delete", reviewController.deleteReview);

module.exports = router;
