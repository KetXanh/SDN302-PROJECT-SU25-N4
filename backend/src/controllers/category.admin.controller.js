// src/controllers/category.admin.controller.js

const Category = require('../models/category');

// Lấy tất cả danh mục (Get all categories)
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

// Thêm danh mục mới (Create a new category)
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }
        const newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

// Cập nhật danh mục (Update a category)
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Lấy cả name và description từ request body
        const { name, description } = req.body; 

        // Kiểm tra xem ít nhất một trong hai trường có tồn tại không
        if (!name && !description) {
            return res.status(400).json({ message: 'Name or description is required for update' });
        }

        // Tạo đối tượng chứa dữ liệu cần cập nhật
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            updateData, // Sử dụng đối tượng updateData
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};

// Xóa danh mục (Delete a category)
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};