const express = require("express");
const router = express.Router();
const {
  listProductsCus,
  getProductByIdCus,
} = require("../controllers/product.customer.controller");

// GET /api/products
router.get("/", listProductsCus);

// GET /api/products/:id
router.get("/:id", getProductByIdCus);

module.exports = router;
