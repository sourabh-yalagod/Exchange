import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    asset: { type: String, required: true },
    type: { type: String, enum: ["market", "limit"], required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    side: { type: String, enum: ["asks", "bids"], default: "bids" },
    status: {
      type: String,
      enum: ["open", "filled", "cancelled"],
      default: "open",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

export const Trade =
  mongoose.models?.trades || mongoose.model("trades", tradeSchema);
