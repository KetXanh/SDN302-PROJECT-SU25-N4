const express = require('express');
const router = express.Router();

// Import middleware
const { authenticateJWT } = require('../middlewares/jwtMiddleware');

// Import routes 
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const orderRoutes = require("./order");
const customerRouters = require("./customer");
const discountRoyters = require("./discount");
const categoryRoyters = require("./category")

// Use routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use("/order", orderRoutes);
router.use("/products", require("./product"));
router.use("/category",categoryRoyters);
router.use("/customer", customerRouters);
router.use("/discount", discountRoyters);
router.use('/admin', require('./product.admin.route'));
router.use('/admin', require('./category.admin.route'));

module.exports = router;