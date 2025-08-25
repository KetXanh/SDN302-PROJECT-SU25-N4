const Discount = require("../models/discount");
const Customer = require("../models/customer");

// Lấy danh sách discount (có thể filter theo rank, active)
exports.getDiscounts = async (req, res) => {
  try {
    const { rank } = req.query; // optional: filter theo rank
    let query = { isActive: true };
    if (rank) query.customerRank = rank;
    const discounts = await Discount.find(query).sort({ value: -1 });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo discount
exports.createDiscount = async (req, res) => {
  try {
    const discount = new Discount(req.body);
    await discount.save();
    res.status(201).json(discount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật discount
exports.updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!discount)
      return res.status(404).json({ message: "Discount not found" });
    res.json(discount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa discount
exports.deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount)
      return res.status(404).json({ message: "Discount not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Áp dụng discount khi checkout
exports.applyDiscount = async (req, res) => {
  try {
    const { customerPhone, orderTotal } = req.body;

    let customer = null;
    if (customerPhone) {
      customer = await Customer.findOne({ phone: customerPhone });
    }

    // Lấy discount phù hợp với rank khách hoặc default Normal
    const rank = customer?.rank || "Normal";
    const discount = await Discount.findOne({
      isActive: true,
      customerRank: rank,
    }).sort({ value: -1 });

    if (!discount) return res.json({ discount: null, finalTotal: orderTotal });

    let discountAmount = 0;
    if (discount.type === "percent") {
      discountAmount = Math.round(orderTotal * (discount.value / 100));
    } else {
      discountAmount = discount.value;
    }

    if (discount.maxAmount > 0)
      discountAmount = Math.min(discountAmount, discount.maxAmount);
    discountAmount = Math.max(0, Math.min(discountAmount, orderTotal));

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
