const Order = require("../models/order");

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, items, discountCode } = req.body;

    // Tính tổng tiền gốc
    let total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Nếu có mã giảm giá
    let discount = 0;
    if (discountCode === "SALE10") {
      discount = total * 0.1; // Giảm 10%
    }
    const finalTotal = total - discount;

    const newOrder = new Order({
      customerName,
      customerPhone,
      items,
      discountCode,
      totalPrice: total,
      finalPrice: finalTotal,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo order", error });
  }
};

// Lấy danh sách tất cả đơn hàng
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy orders", error });
  }
};

// Lấy chi tiết 1 đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId"
    );
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy order" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy order", error });
  }
};

// Cập nhật đơn hàng
exports.updateOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, items, discountCode, status } =
      req.body;

    let total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    let discount = 0;
    if (discountCode === "SALE10") {
      discount = total * 0.1;
    }
    const finalTotal = total - discount;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        customerPhone,
        items,
        discountCode,
        status,
        totalPrice: total,
        finalPrice: finalTotal,
      },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Không tìm thấy order" });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật order", error });
  }
};

//  Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ message: "Không tìm thấy order" });
    res.json({ message: "Đã xóa order thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa order", error });
  }
};
