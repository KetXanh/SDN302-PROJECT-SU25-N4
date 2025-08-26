const Discount = require("../models/discount");
const Customer = require("../models/customer");

// Lấy danh sách discount (có thể filter theo rank, active)
const getDiscounts = async (req, res) => {
  try {
    const { rank } = req.query;
     let query = {};
    if (rank) query.customerRank = rank;

    const discounts = await Discount.find(query).sort({ value: -1 });
    res.json(discounts);
  } catch (err) {
    // 👈 SỬA typo erar -> err
    res.status(500).json({ message: err.message });
  }
};


// Tạo discount
const createDiscount = async (req, res) => {
  try {
    const discount = new Discount(req.body);
    await discount.save();
    res.status(201).json(discount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật discount
const updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!discount) return res.status(404).json({ message: "Discount not found" });
    res.json(discount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa discount
const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) return res.status(404).json({ message: "Discount not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Áp dụng discount khi checkout
const applyDiscount = async (req, res) => {
  try {
    const { customerPhone, orderTotal, channel } = req.body;
    let customer = null;

    if (customerPhone) {
      customer = await Customer.findOne({ phone: customerPhone });
    }

    const rank = customer?.rank || "Normal";

    // Tìm discount phù hợp
    const discount = await Discount.findOne({
      isActive: true,
      customerRank: rank,
      channel: { $in: [channel, "all"] },
      $or: [
        { usageLimit: 0 }, // không giới hạn
        { $expr: { $lt: ["$usedCount", "$usageLimit"] } },
      ],
      $or: [{ startDate: null }, { startDate: { $lte: new Date() } }],
      $or: [{ endDate: null }, { endDate: { $gte: new Date() } }],
    }).sort({ value: -1 });

    if (!discount) {
      return res.json({ discount: null, finalTotal: orderTotal });
    }

    // Check min order value
    if (orderTotal < discount.minOrderValue) {
      return res.json({ discount: null, finalTotal: orderTotal });
    }

    // Tính số tiền giảm
    let discountAmount =
      discount.type === "percent"
        ? Math.round(orderTotal * (discount.value / 100))
        : discount.value;

    if (discount.maxAmount > 0) {
      discountAmount = Math.min(discountAmount, discount.maxAmount);
    }
    discountAmount = Math.max(0, Math.min(discountAmount, orderTotal));

    // Tăng số lần đã dùng
    await Discount.findByIdAndUpdate(discount._id, {
      $inc: { usedCount: 1 },
    });

    res.json({
      discount: {
        code: discount.code,
        type: discount.type,
        value: discount.value,
        amountApplied: discountAmount,
      },
      finalTotal: orderTotal - discountAmount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy discount theo code
const getByCode = async (req, res) => {
  try {
    const code = String(req.params.code || "").trim().toUpperCase();
    if (!code) return res.status(400).json({ message: "Missing code" });

    const d = await Discount.findOne({ code }).lean();
    if (!d) return res.status(404).json({ message: "Discount not found" });

    const now = Date.now();
    if (!d.isActive) return res.status(400).json({ message: "Discount inactive" });
    if (d.startDate && new Date(d.startDate).getTime() > now)
      return res.status(400).json({ message: "Discount not started" });
    if (d.endDate && new Date(d.endDate).getTime() < now)
      return res.status(400).json({ message: "Discount expired" });
    if (d.usageLimit && d.usedCount >= d.usageLimit)
      return res.status(400).json({ message: "Usage limit reached" });

    res.json(d);
  } catch (err) {
    res.status(500).json({ message: "Error fetching discount", error: err.message });
  }
};
const toggleDiscountActive = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }

    discount.isActive = !discount.isActive;
    await discount.save(); // 🔥 lưu thay đổi vào DB

    res.json({ message: "Status updated successfully", discount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  applyDiscount,
  getByCode,
  toggleDiscountActive
};
