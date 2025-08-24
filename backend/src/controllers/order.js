// controllers/orderController.js
const Order = require("../models/order");
const Customer = require("../models/customer");

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

// ---------------- EXPORT ----------------
module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
