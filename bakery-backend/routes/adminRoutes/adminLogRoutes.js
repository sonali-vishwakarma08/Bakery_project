const express = require('express');
const router = express.Router();
const adminLogController = require('../../controllers/adminContoller/adminLogController');
const { verifyToken, requireAdmin } = require('../../middleware/auth');

// All routes require admin access
router.get('/', verifyToken, requireAdmin, adminLogController.getAdminLogs);
router.get('/:id', verifyToken, requireAdmin, adminLogController.getAdminLogById);
router.post('/create', verifyToken, requireAdmin, adminLogController.createAdminLog);
router.post('/delete', verifyToken, requireAdmin, adminLogController.deleteAdminLog);

module.exports = router;

