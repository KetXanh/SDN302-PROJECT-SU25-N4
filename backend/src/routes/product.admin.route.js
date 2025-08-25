const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.admin.controller');

// Route thêm sản phẩm
router.post('/', productController.createProduct);

// Route cập nhật sản phẩm theo ID
router.put('/:id', productController.updateProduct);

// Route xóa sản phẩm theo ID
router.delete('/:id', productController.deleteProduct);

// Route lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);

// Route lấy một sản phẩm theo ID
router.get('/:id', productController.getProductById);

module.exports = router;
