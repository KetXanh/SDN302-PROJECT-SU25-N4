const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

// GET all
router.get("/", getAllCategories);

// GET by id
router.get("/:id", getCategoryById);

// POST create
router.post("/", createCategory);

// PUT update
router.put("/:id", updateCategory);

// DELETE
router.delete("/:id", deleteCategory);

module.exports = router;
