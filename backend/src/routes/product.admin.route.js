const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.admin.controller');

// Route thêm sản phẩm
router.post('/products', productController.createProduct);

// Route cập nhật sản phẩm theo ID
router.put('/products/:id', productController.updateProduct);

// Route xóa sản phẩm theo ID
router.delete('/products/:id', productController.deleteProduct);

// Route lấy tất cả sản phẩm
router.get('/products', productController.getAllProducts);

// Route lấy một sản phẩm theo ID
router.get('/products/:id', productController.getProductById);

module.exports = router;
