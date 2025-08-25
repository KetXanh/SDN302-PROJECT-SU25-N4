// src/routes/category.admin.route.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.admin.controller');

// Route lấy tất cả danh mục
router.get('/categories', categoryController.getAllCategories);

module.exports = router;