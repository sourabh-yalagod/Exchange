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
  const buyer = await Trade.findOne({ orderId: payload.buyerOrderId });
  const seller = await Trade.findOne({ orderId: payload.sellerOrderId });
  console.log("Payload : ", payload);

  if (!seller) {
    console.log("no seller");
    return;
  }
  if (!buyer) {
    console.log("no buyer");
    return;
  }
  if (payload.side == "bids") {
    buyer.status = "filled";
    if (payload.filled) {
      seller.status = "filled";
    }
  }
  if (payload.side == "asks") {
    seller.status = "filled";
    if (payload.filled) {
      buyer.status = "filled";
    }
  }

  await buyer.save();
  await seller.save();
  console.log("Buyer", buyer);
  console.log("Seller", seller);
};
