import { OrderBook } from "../model/orderBook";
import { Trade } from "../model/trade";
import { User } from "../model/user";

export const recordDepositeRecord = async (payload: any) => {
  const user = await User.findById(payload.userId);
  const depositeHistory: any[] = user?.depositHistory;
  depositeHistory.push({ ...payload, createdAt: new Date() });
  user.depositHistory = depositeHistory;
  user.balance += Number(payload?.amount);
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
};
export const handleOrderBookSnapShot=async(payload:any)=>{
  const asset = payload.bids[0]?.asset??payload.asks[0]?.asset
  let isOrderBookexist = await OrderBook.findOne({asset:asset})
  if(!isOrderBookexist){
    isOrderBookexist = await OrderBook.create({asset,bids:payload.bids,asks:payload.asks})   
  }else{
    isOrderBookexist.bids=payload.bids
    isOrderBookexist.asks=payload.asks
    await isOrderBookexist.save()
  }
  console.log("isOrderBookexist",isOrderBookexist)
  
}