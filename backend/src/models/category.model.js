const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // tên category, ví dụ: "duy"
  description: { type: String }, // mô tả category (tùy chọn)
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
