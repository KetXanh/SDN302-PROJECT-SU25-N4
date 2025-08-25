const Category = require("../models/category");

// GET /api/category?q=...&status=Active|Inactive
const getAllCategories = async (req, res) => {
  try {
    const { q, status } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }

    const cats = await Category.find(filter).sort({ name: 1 });
    res.json(cats);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};

// GET /api/category/:id
const getCategoryById = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json(cat);
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({ message: "Error fetching category", error: err.message });
  }
};

// POST /api/category
const createCategory = async (req, res) => {
  try {
    const { name, description = "", status = "Active" } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Tên danh mục là bắt buộc" });
    }

    // unique theo schema; kiểm tra mềm để báo lỗi dễ hiểu
    const existed = await Category.findOne({ name: name.trim() });
    if (existed) {
      return res.status(409).json({ message: "Danh mục đã tồn tại" });
    }

    const cat = new Category({ name: name.trim(), description, status });
    await cat.save();
    res.status(201).json({ message: "Tạo danh mục thành công", data: cat });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Error creating category", error: err.message });
  }
};

// PUT /api/category/:id
const updateCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Không tìm thấy danh mục" });

    const { name, description, status } = req.body;

    if (name && name.trim() && name.trim() !== cat.name) {
      const existed = await Category.findOne({ name: name.trim() });
      if (existed) return res.status(409).json({ message: "Tên danh mục đã tồn tại" });
      cat.name = name.trim();
    }
    if (typeof description === "string") cat.description = description;
    if (status) cat.status = status;

    await cat.save();
    res.json({ message: "Cập nhật danh mục thành công", data: cat });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ message: "Error updating category", error: err.message });
  }
};

// DELETE /api/category/:id
const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json({ message: "Xóa danh mục thành công" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Error deleting category", error: err.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
