import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      data: Buffer, // có thể lưu ảnh dưới dạng binary
      contentType: String,
      size: Number,
      url: String, // hoặc lưu URL ảnh nếu dùng cloud/local storage
    },
    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Product", productSchema);
