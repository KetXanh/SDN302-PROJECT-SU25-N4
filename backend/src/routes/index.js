const express = require('express');
const router = express.Router();

// Import middleware
const { authenticateJWT } = require('../middlewares/jwtMiddleware');

// Import routes 
const authRoutes = require('./auth.route');

// Use routes
router.use('/auth', authRoutes);

module.exports = router;