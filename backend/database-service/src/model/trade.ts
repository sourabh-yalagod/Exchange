import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    orderId: String,
    price: Number,
    quantity: Number,
    asset: String,
    userId: String,
    status: {
      type: String,
      enum: ["pending", "filled", "closed"],
      default: "pending",
    },
    side: String,
    type: String,
  },
  { timestamps: true }
);

export const Trade =
  mongoose.models?.trades || mongoose.model("trades", tradeSchema);
