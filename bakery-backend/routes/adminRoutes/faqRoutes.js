const express = require('express');
const router = express.Router();
const faqController = require('../../controllers/adminContoller/faqController');
const { verifyToken, requireAdmin } = require('../../middleware/auth');

// Get all FAQs (public or admin)
router.get('/', faqController.getFAQs);
router.get('/:id', faqController.getFAQById);

// Admin only routes
router.post('/create', verifyToken, requireAdmin, faqController.createFAQ);
router.post('/update', verifyToken, requireAdmin, faqController.updateFAQ);
router.post('/delete', verifyToken, requireAdmin, faqController.deleteFAQ);

module.exports = router;

