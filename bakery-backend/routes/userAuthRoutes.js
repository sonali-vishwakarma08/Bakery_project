const router = require('express').Router();
const authCtrl = require('../controllers/userController/userAuthController');

// Register a new user
router.post('/register', authCtrl.register);

// Login with email/password
router.post('/login', authCtrl.login);

// Social logins
router.post('/google', authCtrl.googleLogin);
router.post('/apple', authCtrl.appleLogin);

// Password management
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);

module.exports = router;
