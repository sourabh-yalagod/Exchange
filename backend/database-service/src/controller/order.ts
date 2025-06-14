import { asyncHandler, ApiResponse, ApiError } from "@sourabhyalagod/helper";
import { Request, Response } from "express";
import { Trade } from "../model/trade";

const closeOrder = asyncHandler(async (req: Request, res: Response) => {});
const fetchOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"];
  try {
    if (!userId) {
      throw new ApiError("userId required...!", 401);
    }
    const orders = await Trade.find({ userId });
    res.json(new ApiResponse(201, "trade fetched", { orders }));
  } catch (error: any) {
    throw new ApiError(error?.message || "something went wrong", 401);
  }
});

export { closeOrder, fetchOrders };
