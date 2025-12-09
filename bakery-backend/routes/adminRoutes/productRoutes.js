const express = require("express");
const router = express.Router();
const productController = require("../../controllers/adminContoller/productController");
const upload = require("../../middleware/upload");
const { verifyToken, requireAdmin } = require("../../middleware/auth");

// Public routes - no auth required
// IMPORTANT: Specific routes must come before parameterized routes
router.get("/all", productController.getProducts); // Legacy route - must come before /:id
router.get("/featured", productController.getFeaturedProducts);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// Admin routes - auth and admin required
router.post(
  "/create",
  verifyToken,
  requireAdmin,
  upload.single("image"),
  productController.createProduct
);

router.post(
  "/update",
  verifyToken,
  requireAdmin,
  upload.single("image"),
  productController.updateProduct
);

router.post(
  "/delete",
  verifyToken,
  requireAdmin,
  productController.deleteProduct
);

module.exports = router;
