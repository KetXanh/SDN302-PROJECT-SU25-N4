// controllers/product.customer.controller.js
const mongoose = require("mongoose");
const Product = require("../models/product");

/**
 * GET /api/product
 */
const listProductsCus = async (req, res) => {
  try {
    const {
      q = "",
      category = "",
      status = "Available",
      page = 1,
      limit = 12,
      sort = "-createdAt",
    } = req.query;

    const filter = {};
    // chỉ show hàng bán được theo default
    if (status) filter.status = status;

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }

    if (category && mongoose.isValidObjectId(category)) {
      filter.categoryId = category;
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 60);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Product.find(filter)
        .select("name price image.url status categoryId")
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    // Bảo đảm FE so sánh được categoryId là string
    const data = items.map((p) => ({
      ...p,
      _id: String(p._id),
      categoryId: p.categoryId ? String(p.categoryId) : null,
    }));

    res.json({
      data,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("Error list products:", err);
    res
      .status(500)
      .json({ message: "Error listing products", error: err.message });
  }
};

/**
 * GET /api/product/:id
 */
const getProductByIdCus = async (req, res) => {
  try {
    const doc = await Product.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const product = {
      ...doc,
      _id: String(doc._id),
      categoryId: doc.categoryId ? String(doc.categoryId) : null,
    };

    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res
      .status(500)
      .json({ message: "Error fetching product", error: err.message });
  }
};

module.exports = {
  listProductsCus,
  getProductByIdCus,
};
