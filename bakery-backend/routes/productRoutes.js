const express = require('express');
const router = express.Router();

// Sample route
router.get('/product', (req, res) => {
  res.send('Product route is working!');
});

module.exports = router;