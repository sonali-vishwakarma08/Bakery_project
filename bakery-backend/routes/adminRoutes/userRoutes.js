const router = require('express').Router();
const userCtrl = require('../../controllers/adminContoller/userController');
const authMiddleware = require('../../middleware/auth');

// All POST routes (Admin only)
router.post('/all', authMiddleware.verifyToken, authMiddleware.requireAdmin, userCtrl.getAllUsers);
router.post('/single', authMiddleware.verifyToken, authMiddleware.requireAdmin, userCtrl.getUserById);
router.post('/create', authMiddleware.verifyToken, authMiddleware.requireAdmin, userCtrl.createUser);
router.post('/update', authMiddleware.verifyToken, authMiddleware.requireAdmin, userCtrl.updateUser);
router.post('/delete', authMiddleware.verifyToken, authMiddleware.requireAdmin, userCtrl.deleteUser);

module.exports = router;
