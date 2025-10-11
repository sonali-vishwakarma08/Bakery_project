const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middleware/auth");
const dashboardController = require("../controllers/dashboardController");

// Dashboard stats endpoint
router.get("/dashboard-stats", verifyToken, requireAdmin, dashboardController.getDashboardStats);

// Best sellers endpoint
router.get("/best-sellers", verifyToken, requireAdmin, dashboardController.getBestSellers);

// Recent orders endpoint
router.get("/recent-orders", verifyToken, requireAdmin, dashboardController.getRecentOrders);

// Recent activity endpoint
router.get("/recent-activity", verifyToken, requireAdmin, dashboardController.getRecentActivity);

// Chart data endpoints
router.get("/sales-chart", verifyToken, requireAdmin, dashboardController.getSalesChart);
router.get("/category-chart", verifyToken, requireAdmin, dashboardController.getCategoryChart);
router.get("/customer-growth-chart", verifyToken, requireAdmin, dashboardController.getCustomerGrowthChart);

module.exports = router;
