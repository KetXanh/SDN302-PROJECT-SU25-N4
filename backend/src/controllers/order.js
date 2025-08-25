// controllers/orderController.js
const Order = require("../models/order");
const Customer = require("../models/customer");
const User = require("../models/user.model");
require('dotenv').config();

// ---------------- HELPER ----------------
const prepareOrderData = (body) => {
  const { customerId, customerPhone, ...rest } = body;
  return {
    ...rest,
    customerId: customerId || null, // có thể null
    customerPhone: customerPhone || null, // có thể null
  };
};

// ---------------- CONTROLLERS ----------------

// Lấy tất cả đơn hàng
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("employeeId", "fullname email role") // nhân viên
      .populate("customerId", "name phone rank") // khách hàng (nếu có)
      .populate("items.productId", "name price stock"); // sản phẩm

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
};

// Lấy đơn hàng theo ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("employeeId", "fullname email role")
      .populate("customerId", "name phone rank")
      .populate("items.productId", "name price stock");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res
      .status(500)
      .json({ message: "Error fetching order", error: err.message });
  }
};

// Tạo đơn hàng
const createOrder = async (req, res) => {
  try {
    const orderData = prepareOrderData(req.body);
    const newOrder = new Order(orderData);

    await newOrder.save();

    // populate sau khi lưu
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("employeeId", "fullname email role")
      .populate("customerId", "name phone rank")
      .populate("items.productId", "name price stock");

    res
      .status(201)
      .json({ message: "Tạo đơn hàng thành công", data: populatedOrder });
  } catch (err) {
    console.error("Error creating order:", err);
    res
      .status(500)
      .json({ message: "Error creating order", error: err.message });
  }
};

// Cập nhật đơn hàng
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // update dữ liệu từ body
    const orderData = prepareOrderData(req.body);
    Object.assign(order, orderData);

    await order.save(); // chạy pre('validate')

    // populate đúng cách (chạy tuần tự hoặc truyền mảng)
    await order.populate([
      { path: "employeeId", select: "fullname email role" },
      { path: "customerId", select: "name phone rank" },
      { path: "items.productId", select: "name price stock" },
    ]);

    res.status(200).json({
      message: "Cập nhật đơn hàng thành công",
      data: order,
    });
  } catch (err) {
    console.error("Error updating order:", err);
    res
      .status(500)
      .json({ message: "Error updating order", error: err.message });
  }
};


// Xóa đơn hàng
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res
      .status(500)
      .json({ message: "Error deleting order", error: err.message });
  }
};


// KHÔNG đăng nhập: tạo order với employee mặc định
const createOrderPublic = async (req, res) => {
  try {
    const body = req.body || {};
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    const employeeId = req.user.id;
    if (!employeeId) {
      return res.status(500).json({ message: "Thiếu employeeId trong JWT" });
    }

    // bảo đảm employee mặc định tồn tại
    const emp = await User.findOne({ _id: employeeId }).select("_id");
    if (!emp) {
      return res.status(500).json({ message: "employeeId không hợp lệ hoặc nhân viên không Active" });
    }

    const newOrder = new Order({
      employeeId: employeeId,                 // gắn mặc định để pass required
      customerId: body.customerId || null,
      customerPhone: body.customerPhone || null,
      items: body.items,                        
      subtotal: body.subtotal || 0,             
      discount: body.discount || undefined,
      finalTotal: 0,                            
      paymentMethod: body.paymentMethod || "cash",
      isPaid: body.isPaid ?? true,
      note: body.note || "",
    });

    await newOrder.save();

    const populated = await Order.findById(newOrder._id)
      .populate("employeeId", "fullname email role")
      .populate("customerId", "name phone rank")
      .populate("items.productId", "name price");

    res.status(201).json({ message: "Tạo đơn hàng thành công", data: populated });
  } catch (err) {
    console.error("Error creating public order:", err);
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
};

// Nhân viên xác nhận đơn: cập nhật employeeId (và optional: status)
const assignOrderEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, status } = req.body; // status optional: 'confirmed' | 'completed' | 'cancelled'

    if (!employeeId) {
      return res.status(400).json({ message: "Thiếu employeeId" });
    }

    const emp = await User.findOne({ _id: employeeId, role: "Employee", status: "Active" }).select("_id");
    if (!emp) {
      return res.status(400).json({ message: "employeeId không hợp lệ hoặc nhân viên không Active" });
    }

    const patch = { employeeId };
    if (status && ["confirmed", "completed", "cancelled"].includes(status)) {
      patch.status = status;
    }

    const order = await Order.findByIdAndUpdate(id, patch, { new: true })
      .populate("employeeId", "fullname email role")
      .populate("customerId", "name phone rank")
      .populate("items.productId", "name price");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({ message: "Gán nhân viên thành công", data: order });
  } catch (err) {
    console.error("Error assigning order:", err);
    res.status(500).json({ message: "Error assigning order", error: err.message });
  }
};


// ---------------- EXPORT ----------------
module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  createOrderPublic,
  assignOrderEmployee,
};
