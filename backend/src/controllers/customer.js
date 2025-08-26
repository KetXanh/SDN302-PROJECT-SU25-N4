const Customer = require("../models/customer");
const ExcelJS = require("exceljs");

const validatePhoneUnique = async (phone, id = null) => {
  const existing = await Customer.findOne({ phone });
  if (existing && existing._id.toString() !== id) {
    throw new Error("Số điện thoại đã tồn tại");
  }
};



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

    await customer.save(); 

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
    if (totalPoints !== undefined) customer.totalPoints = totalPoints; 
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
// Export Excel
const exportCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Customers");
     const exportDate = new Date().toLocaleString("vi-VN");


    worksheet.columns = [
      { header: "ID", key: "_id", width: 25 },
      { header: "Name", key: "name", width: 25 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Email", key: "email", width: 30 },
      { header: "Total Points", key: "totalPoints", width: 15 },
      { header: "Rank", key: "rank", width: 12 },
      { header: "Status", key: "status", width: 12 },
      { header: "Note", key: "note", width: 25 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
    ];

    customers.forEach((c) => {
      worksheet.addRow({
        _id: c._id.toString(),
        name: c.name,
        phone: c.phone,
        email: c.email || "",
        totalPoints: c.totalPoints,
        rank: c.rank,
        status: c.status,
        note: c.note || "",
        createdAt: new Date(c.createdAt).toLocaleString(),
        updatedAt: new Date(c.updatedAt).toLocaleString(),
      });
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDDEBF7" },
      };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=customers.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error exporting customers:", err);
    res
      .status(500)
      .json({ message: "Error exporting customers", error: err.message });
  }
};



module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  exportCustomers
};

    //  worksheet.addRow([`Xuất ngày: ${exportDate}`]);
    //  worksheet.mergeCells("A1:J1");
    //  worksheet.getCell("A1").font = { bold: true, size: 12 };
    //  worksheet.getCell("A1").alignment = { horizontal: "center" };
    //  worksheet.addRow([]);