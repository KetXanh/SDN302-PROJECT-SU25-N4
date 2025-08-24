const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: { type: String, enum: ["percent", "fixed"], required: true }, // % hoặc số tiền cố định
    value: { type: Number, required: true, min: 0 }, // ví dụ: 10 (%), hoặc 20000 (đ)
    maxAmount: { type: Number, default: 0 }, // trần số tiền giảm (0 = không trần)
    minOrderValue: { type: Number, default: 0 }, // đơn tối thiểu để áp dụng
    usageLimit: { type: Number, default: 0 }, // 0 = không giới hạn
    usedCount: { type: Number, default: 0 },

    // Vì là order tại quầy:
    channel: { type: String, enum: ["counter", "all"], default: "counter" },

    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },

    // Ai tạo/chỉnh (Employee/Admin)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Discount", discountSchema);
