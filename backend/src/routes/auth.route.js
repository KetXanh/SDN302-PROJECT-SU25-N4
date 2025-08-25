const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Login route
router.post('/login', authController.login);

// Register route
router.post('/register', authController.register);

// Logout route
router.post('/logout', authController.logout);

// Forgot password route
router.post('/forgot-password', authController.forgotPassword);

// Verify OTP route
router.post('/verify-otp', authController.verifyOtp);

// Reset password route
router.post('/reset-password', authController.resetPassword);

// Refresh token route
router.post('/refresh-token', authController.refreshToken);

// Export the router
module.exports = router;