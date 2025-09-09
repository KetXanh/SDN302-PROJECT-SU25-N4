const express = require('express');
const router = express.Router();

// Import middleware
const { authenticateJWT } = require('../middlewares/jwtMiddleware');
const { logUserActivity } = require('../config/logger');
// Import routes 
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const orderRoutes = require("./order");
const customerRouters = require("./customer");
const discountRoyters = require("./discount");
const categoryRoyters = require("./category")

// Use routes
router.use('/auth', logUserActivity, authRoutes);
router.use('/user', authenticateJWT, logUserActivity, userRoutes);
router.use("/order", authenticateJWT, logUserActivity, orderRoutes);
router.use("/customer", authenticateJWT, logUserActivity, customerRouters);
router.use("/discount", authenticateJWT, logUserActivity, discountRoyters);
router.use('/products', authenticateJWT, logUserActivity, require('./product.admin.route'));
router.use('/categories', authenticateJWT, logUserActivity, require('./category.admin.route'));

module.exports = router;