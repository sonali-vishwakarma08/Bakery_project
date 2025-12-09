const router = require('express').Router();
const authCtrl = require('../../controllers/userController/authController');
const authMiddleware = require('../../middleware/auth');
const upload = require('../../middleware/upload');

// Public routes
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/google', authCtrl.googleLogin);
router.post('/apple', authCtrl.appleLogin);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);

// Protected routes
router.post('/logout', authMiddleware.verifyToken, authCtrl.logout);
router.get('/profile', authMiddleware.verifyToken, authCtrl.getProfile);
router.post('/update-profile', authMiddleware.verifyToken, upload.single('profile_image'), authCtrl.updateProfile);
router.post('/change-password', authMiddleware.verifyToken, authCtrl.changePassword);

module.exports = router;
