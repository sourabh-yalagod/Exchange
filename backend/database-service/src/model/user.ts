import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: {
      required: false,
      type: String,
    },
    balance: {
      required: false,
      type: Number,
      default: 0,
    },
    trades: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "trades",
      },
    ],
    depositHistory: [
      {
        amount: Number,
        method: String,
        status: {
          type: String,
          enum: ["pending", "completed", "failed"],
          default: "pending",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    withdrawalHistory: [
      {
        amount: Number,
        method: String,
        address: String,
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export const User =
  mongoose.models["users"] || mongoose.model("users", userSchema);
