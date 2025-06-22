import { asyncHandler, ApiError, ApiResponse } from "@sourabhyalagod/helper";
import { Request, Response } from "express";
import { OrderBook } from "../model/orderBook";

const getOrderBook=asyncHandler(async(req:Request,res:Response)=>{
    const {asset}=req.params
    console.log(asset);
    
    const orderBookRaw = await OrderBook.findOne({asset});
    let orderBook = {bids:[],asks:[]}
    orderBook.bids = Object.values(
    orderBookRaw?.bids
        ?.sort((a: any, b: any) => b.price - a.price)
        .slice(0, 20)
        .reduce(
        (acc: Record<number, { price: number; quantity: number }>, order: any) => {
            if (!acc[order.price]) {
            acc[order.price] = { price: order.price, quantity: 0 };
            }
            acc[order.price].quantity += order.quantity;
            return acc;
        },
        {}
        )
    );

    orderBook.asks = Object.values(
    orderBookRaw?.asks
        ?.sort((a: any, b: any) => a.price - b.price)
        .slice(0, 20)
        .reduce(
        (acc: Record<number, { price: number; quantity: number }>, order: any) => {
            if (!acc[order.price]) {
            acc[order.price] = { price: order.price, quantity: 0 };
            }
            acc[order.price].quantity += order.quantity;
            return acc;
        },
        {}
        )
    )
    res.json(new ApiResponse(201,`${asset} orderbook fetched sucessfully.`,orderBook))
    return
})
export {getOrderBook}