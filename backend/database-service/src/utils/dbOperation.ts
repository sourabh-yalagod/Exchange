import mongoose from "mongoose";
import { Trade } from "../model/trade";
import { User } from "../model/user";

export const recordDepositeRecord = async (payload: any) => {
  const user = await User.findById(payload.userId);
  const depositeHistory: any[] = user?.depositHistory;
  depositeHistory.push({ ...payload, createdAt: new Date() });
  user.depositHistory = depositeHistory;
  await user.save();
  console.log("User : ", user);
};

export const recordTrade = async (payload: any) => {
  const trade = await Trade.create(payload);
  return trade;
};
export const handleTransaction = async (payload: any) => {
  console.log(payload);

  const buyer = await Trade.findOne({ orderId: payload.buyerOrderId });
  const seller = await Trade.findOne({ orderId: payload.sellerOrderId });
  if (!seller) {
    console.log("no seller");
    return;
  }
  if (!buyer) {
    console.log("no buyer");
    return;
  }
  if (payload.quantity == 0) {
    seller.quantity = 0;
    buyer.quantity = 0;
  }
  if (payload.side == "bids") {
    if (payload.quantity > 0) {
      seller.quantity = 0;
    }
  } else {
    buyer.quantity = payload.quantity;
  }
  if (payload.side == "asks") {
    if (payload.quantity > 0) {
      buyer.quantity = 0;
    }
  } else {
    seller.quantity = payload.quantity;
  }
  await buyer.save();
  await seller.save();
};
