const Product = require('../models/product');
const Category = require('../models/category');

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, image, stock, categoryId } = req.body;

        // Kiểm tra xem categoryId có tồn tại không
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const newProduct = new Product({
            name,
            price,
            description,
            image,
            stock,
            categoryId
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, image, stock, categoryId } = req.body;

   
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, description, image, stock, categoryId },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 6, search = '' } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        const query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa, chữ thường
        }

        const products = await Product.find(query)
            .populate('categoryId', 'name')
            .limit(limitNumber)
            .skip((pageNumber - 1) * limitNumber);

        const totalProducts = await Product.countDocuments(query);

        res.status(200).json({
            products,
            totalProducts,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalProducts / limitNumber),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};
// Lấy một sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categoryId');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};