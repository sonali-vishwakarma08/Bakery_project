const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/auth");

// Create a new review → Any authenticated user (customer)
router.post("/create", authMiddleware.verifyToken, authMiddleware.requireCustomer, reviewController.createReview);

// Get all reviews → Any authenticated user
router.get("/all", authMiddleware.verifyToken, reviewController.getReviews);

// Get single review by ID → Any authenticated user
router.get("/:id", authMiddleware.verifyToken, reviewController.getReviewById);

// Update review → Admin or the customer who created it
router.put("/update/:id", authMiddleware.verifyToken, reviewController.updateReview);

// Delete review → Admin or the customer who created it
router.delete("/delete/:id", authMiddleware.verifyToken, reviewController.deleteReview);

module.exports = router;
