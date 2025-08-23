const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  stock: { type: Number, default: 0 },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
