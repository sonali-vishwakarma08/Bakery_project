const express = require('express');
const router = express.Router();
const supportController = require('../../controllers/adminContoller/supportController');
const { verifyToken, requireAdmin } = require('../../middleware/auth');

// Get all support tickets (admin sees all, users see their own)
router.get('/', verifyToken, supportController.getSupportTickets);
router.get('/:id', verifyToken, supportController.getSupportTicketById);

// Create support ticket (authenticated users)
router.post('/create', verifyToken, supportController.createSupportTicket);

// Update support ticket (admin can update status, users can update their own)
router.post('/update', verifyToken, supportController.updateSupportTicket);

// Delete support ticket (admin only)
router.post('/delete', verifyToken, requireAdmin, supportController.deleteSupportTicket);

module.exports = router;

