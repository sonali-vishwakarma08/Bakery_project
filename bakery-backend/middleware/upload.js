// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Dynamic storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine folder based on route
    let folder = "products"; // default
    
    if (req.baseUrl.includes("/categories")) {
      folder = "categories";
    } else if (req.baseUrl.includes("/subcategories")) {
      folder = "subcategories";
    } else if (req.baseUrl.includes("/banners")) {
      folder = "banners";
    } else if (req.baseUrl.includes("/user")) {
      folder = "users";
    }
    
    const uploadDir = path.join(__dirname, `../uploads/${folder}`);
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// only allow images, limit size (adjust as needed)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only image files are allowed (jpeg,jpg,png,webp,gif)."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
