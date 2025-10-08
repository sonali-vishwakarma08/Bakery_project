const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/auth");

// ================== Authenticated routes (customer/admin) ==================

// Create a new review → Customer only
router.post("/create", authMiddleware.verifyToken, authMiddleware.requireCustomer, reviewController.createReview);

// Get all reviews → Any authenticated user
router.post("/all", authMiddleware.verifyToken, reviewController.getReviews);

// Get single review by ID → Any authenticated user
router.post("/get", authMiddleware.verifyToken, reviewController.getReviewById);

// Update review → Admin or the customer who created it
router.post("/update", authMiddleware.verifyToken, reviewController.updateReview);

// Delete review → Admin or the customer who created it
router.post("/delete", authMiddleware.verifyToken, reviewController.deleteReview);

module.exports = router;
