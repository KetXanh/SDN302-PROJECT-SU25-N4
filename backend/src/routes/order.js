const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");

// Tạo đơn hàng mới (employee)
router.post("/", orderController.createOrder);

// Lấy danh sách tất cả order (admin)
router.get("/", orderController.getAllOrders);

// Lấy chi tiết 1 order (admin + employee)
router.get("/:id", orderController.getOrderById);

// Cập nhật trạng thái đơn hàng (employee)
router.put("/:id", orderController.updateOrder);

// Xóa đơn hàng (admin)
router.delete("/:id", orderController.deleteOrder);

// KH công khai tạo đơn (không login) -> gắn employee mặc định từ .env
router.post("/public", orderController.createOrderPublic);

// Nhân viên bấm xác nhận -> gán employeeId (và có thể cập nhật status)
router.put("/:id/assign", orderController.assignOrderEmployee);

module.exports = router;
