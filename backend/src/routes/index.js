const express = require('express');
const router = express.Router();

// Import middleware
const { authenticateJWT } = require('../middlewares/jwtMiddleware');

// Import routes 
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');

// Use routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);

module.exports = router;