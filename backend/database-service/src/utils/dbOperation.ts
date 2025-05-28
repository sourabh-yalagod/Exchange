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
  console.log(trade);
};
