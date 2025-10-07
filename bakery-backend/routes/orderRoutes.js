// routes/orderRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Order route is working!');
});

module.exports = router;