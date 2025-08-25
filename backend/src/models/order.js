const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: { type: Number, required: true, min: 0 }, // đơn giá tại thời điểm bán
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 }, // price * quantity
  },
  { _id: false }
);

const discountSnapshotSchema = new mongoose.Schema(
  {
    discountId: { type: mongoose.Schema.Types.ObjectId, ref: "Discount" },
    code: { type: String, uppercase: true, trim: true },
    type: { type: String, enum: ["percent", "fixed"] },
    value: { type: Number, min: 0 }, // % hoặc số tiền
    maxAmount: { type: Number, default: 0 }, // trần (nếu có)
    amountApplied: { type: Number, default: 0, min: 0 }, // số tiền đã giảm thực tế
    appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // NV áp dụng mã
    appliedAt: { type: Date },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    customerPhone: { type: String, trim: true, required: false },

    items: { type: [orderItemSchema], required: true },

    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: discountSnapshotSchema, default: undefined },
    finalTotal: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["confirmed", "completed", "cancelled"],
      default: "confirmed",
    },

    isPaid: { type: Boolean, default: true },
    paidAt: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ["cash", "bank"], default: "cash" },

    note: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false }
);

/**
 * Tính lại lineTotal, subtotal, finalTotal trước khi validate
 * (Không gọi sang bảng Discount — chỉ dùng snapshot đã gắn vào order)
 */
orderSchema.pre("validate", function (next) {
  // Tính lineTotal cho từng item
  this.items = (this.items || []).map((i) => {
    const lineTotal = (i.price || 0) * (i.quantity || 0);
    return { ...(i.toObject?.() ?? i), lineTotal };
  });

  // subtotal
  this.subtotal = (this.items || []).reduce(
    (s, i) => s + (i.lineTotal || 0),
    0
  );

  let discountAmount = 0;
  if (this.discount && this.discount.type && (this.discount.value ?? 0) > 0) {
    const { type, value, maxAmount = 0 } = this.discount;

    if (!this.discount.appliedAt) this.discount.appliedAt = new Date();

    if (type === "percent") {
      discountAmount = Math.round(this.subtotal * (value / 100));
    } else if (type === "fixed") {
      discountAmount = value;
    }

    // Trần giảm
    if (maxAmount > 0) discountAmount = Math.min(discountAmount, maxAmount);
    // Không vượt quá subtotal
    discountAmount = Math.max(0, Math.min(discountAmount, this.subtotal));

    this.discount.amountApplied = discountAmount;
  }

  // final
  this.finalTotal = Math.max(0, this.subtotal - discountAmount);

  next();
});

module.exports = mongoose.model("Order", orderSchema);
