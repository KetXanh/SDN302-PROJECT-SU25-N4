import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true }, // tổng tiền trước giảm giá
    discountCode: { type: String, default: null }, // mã giảm giá
    discountAmount: { type: Number, default: 0 }, // số tiền được giảm
    finalPrice: { type: Number, required: true }, // tổng tiền sau giảm giá
    status: {
      type: String,
      enum: ["confirmed", "completed", "cancelled"],
      default: "confirmed",
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank"],
      default: "cash",
    },
  },
  { timestamps: true }
);


orderSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  next();
});

export default mongoose.model("Order", orderSchema);
