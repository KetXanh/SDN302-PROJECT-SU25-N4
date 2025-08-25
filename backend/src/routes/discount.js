const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discount");

router.get("/code/:code", discountController.getByCode);

router.get("/", discountController.getDiscounts);
router.post("/", discountController.createDiscount);
router.put("/:id", discountController.updateDiscount);
router.delete("/:id", discountController.deleteDiscount);

// Áp dụng discount khi checkout
router.post("/apply", discountController.applyDiscount);

module.exports = router;

