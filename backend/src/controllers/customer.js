const Customer = require("../models/customer");

// ---------------- HELPER ----------------
const validatePhoneUnique = async (phone, id = null) => {
  // Nếu id có nghĩa là update, bỏ qua bản ghi hiện tại
  const existing = await Customer.findOne({ phone });
  if (existing && existing._id.toString() !== id) {
    throw new Error("Số điện thoại đã tồn tại");
  }
};

// ---------------- CONTROLLERS ----------------

// Lấy tất cả khách hàng
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res
      .status(500)
      .json({ message: "Error fetching customers", error: err.message });
  }
};

// Lấy khách hàng theo ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    res.status(200).json(customer);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res
      .status(500)
      .json({ message: "Error fetching customer", error: err.message });
  }
};

// Tạo khách hàng
const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, totalPoints, status, note } = req.body;

    // validate phone
    if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ message: "Số điện thoại phải có 10 chữ số" });
    }
    await validatePhoneUnique(phone);

    const customer = new Customer({
      name,
      phone,
      email: email || null,
      totalPoints: totalPoints || 0,
      status: status || "Active",
      note: note || "",
    });

    await customer.save(); // rank sẽ tự động được tính dựa trên totalPoints

    res
      .status(201)
      .json({ message: "Tạo khách hàng thành công", data: customer });
  } catch (err) {
    console.error("Error creating customer:", err);
    res
      .status(500)
      .json({ message: "Error creating customer", error: err.message });
  }
};

// Cập nhật khách hàng
const updateCustomer = async (req, res) => {
  try {
    const { name, phone, email, totalPoints, status, note } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });

    // validate phone
    if (phone) {
      if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
        return res
          .status(400)
          .json({ message: "Số điện thoại phải có 10 chữ số" });
      }
      await validatePhoneUnique(phone, customer._id.toString());
      customer.phone = phone;
    }

    if (name) customer.name = name;
    if (email !== undefined) customer.email = email || null;
    if (totalPoints !== undefined) customer.totalPoints = totalPoints; // rank sẽ update pre-save
    if (status) customer.status = status;
    if (note !== undefined) customer.note = note;

    await customer.save();

    res
      .status(200)
      .json({ message: "Cập nhật khách hàng thành công", data: customer });
  } catch (err) {
    console.error("Error updating customer:", err);
    res
      .status(500)
      .json({ message: "Error updating customer", error: err.message });
  }
};

// Xóa khách hàng
const deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    res.status(200).json({ message: "Xóa khách hàng thành công" });
  } catch (err) {
    console.error("Error deleting customer:", err);
    res
      .status(500)
      .json({ message: "Error deleting customer", error: err.message });
  }
};

// ---------------- EXPORT ----------------
module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
