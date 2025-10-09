const router = require('express').Router();
const userCtrl = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// All POST routes (protected)
router.post('/all', authMiddleware.verifyToken, userCtrl.getAllUsers);
router.post('/single', authMiddleware.verifyToken, userCtrl.getUserById);
router.post('/delete', authMiddleware.verifyToken, userCtrl.deleteUser);
router.post('/update', authMiddleware.verifyToken, userCtrl.updateUser); // new

module.exports = router;
