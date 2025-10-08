const router = require('express').Router();
const authCtrl = require('../controllers/userController/userAuthController');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/google', authCtrl.googleLogin);
router.post('/apple', authCtrl.appleLogin);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);

module.exports = router;
