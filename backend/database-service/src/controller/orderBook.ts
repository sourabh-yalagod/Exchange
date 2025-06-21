import { asyncHandler, ApiError, ApiResponse } from "@sourabhyalagod/helper";
import { Request, Response } from "express";
import { OrderBook } from "../model/orderBook";

const getOrderBook=asyncHandler(async(req:Request,res:Response)=>{
    const {asset}=req.params
    console.log(asset);
    
    const orderBook = await OrderBook.findOne({asset});
    
    const sortedAsks = [...orderBook?.asks]?.sort((a:any, b:any) => a.price - b.price);
    const sortedBids = [...orderBook?.bids]?.sort((a:any, b:any) => b.price - a.price);
    
    const calculateCumulative = (orders: any) => {
        let total = 0;
        return orders.map((order:any) => {
            total += order.quantity;
            return { price:order.price,quantity:order.quantity, cumulative: total };
        });
    };
    
    const asksWithCumulative = calculateCumulative(sortedAsks);
    const bidsWithCumulative = calculateCumulative(sortedBids);
    console.log({asks:asksWithCumulative,bids:bidsWithCumulative});
    res.json(new ApiResponse(201,`${asset} orderbook fetched sucessfully.`,{asks:asksWithCumulative,bids:bidsWithCumulative}))
    return
})
export {getOrderBook}