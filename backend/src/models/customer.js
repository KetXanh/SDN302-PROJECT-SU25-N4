const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    phone: { type: String, unique: true, sparse: true, required: true },
    email: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // không bắt buộc
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} không đúng định dạng email`,
      },
    },
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

// Pre-save hook: cập nhật rank dựa trên totalPoints
customerSchema.pre("save", function (next) {
  const points = this.totalPoints || 0;
  if (points >= 1000) this.rank = "Platinum";
  else if (points >= 500) this.rank = "Gold";
  else if (points >= 200) this.rank = "Silver";
  else this.rank = "Normal";
  next();
});

module.exports = mongoose.model("Customer", customerSchema);
