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
    type: { type: String, enum: ["percent", "fixed"], required: true }, 
    value: { type: Number, required: true, min: 0 }, 
    maxAmount: { type: Number, default: 0 }, 
    minOrderValue: { type: Number, default: 0 },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 }, 
    channel: { type: String, enum: ["counter", "all"], default: "counter" },     
    isActive: { type: Boolean, default: true }, // Có đang kích hoạt
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    customerRank: {
      // Áp dụng cho rank nào
      type: String,
      enum: ["Normal", "Silver", "Gold", "Platinum"],
      default: "Normal",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", discountSchema);
