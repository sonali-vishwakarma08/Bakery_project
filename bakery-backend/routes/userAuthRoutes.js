const router = require('express').Router();
const authCtrl = require('../controllers/userController/userAuthController');
const authMiddleware = require('../middleware/auth'); // ensure this path is correct

// Public routes
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/google', authCtrl.googleLogin);
router.post('/apple', authCtrl.appleLogin);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);

// Protected route
router.post('/logout', authMiddleware.verifyToken, authCtrl.logout);

module.exports = router;
