const express = require('express');
const router = express.Router();

// Import middleware
const { authenticateJWT } = require('../middlewares/jwtMiddleware');

// Import routes 
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const orderRoutes = require("./order");
// Use routes
router.use('/auth', authRoutes);
router.use('/user',authenticateJWT, userRoutes);
router.use("/order", orderRoutes);
router.use('/', require('./product.admin.route'));
router.use('/', require('./category.admin.route'));

module.exports = router;