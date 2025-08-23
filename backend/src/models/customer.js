const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    phone: { type: String, unique: true, sparse: true }, 
    email: { type: String, trim: true },
    totalPoints: { type: Number, default: 0 },
    rank: {
      type: String,
      enum: ["Normal", "Silver", "Gold", "Platinum"],
      default: "Normal",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Banned"],
      default: "Active",
    },
    note: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Customer", customerSchema);
