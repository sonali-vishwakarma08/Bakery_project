const express = require("express");
const router = express.Router();
const productController = require("../controllers/commonController/productController");
const upload = require("../middleware/upload");
const { verifyToken, requireAdmin } = require("../middleware/auth");

router.get("/all", productController.getProducts);

router.post(
  "/create",
  verifyToken,
  requireAdmin,
  upload.single("image"),   // ✅ handle image
  productController.createProduct
);

router.post(
  "/update",
  verifyToken,
  requireAdmin,
  upload.single("image"),   // ✅ handle image on update too
  productController.updateProduct
);

router.post(
  "/delete",
  verifyToken,
  requireAdmin,
  productController.deleteProduct
);

module.exports = router;
