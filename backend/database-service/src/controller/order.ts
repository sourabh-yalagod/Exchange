import { asyncHandler, ApiResponse, ApiError } from "@sourabhyalagod/helper";
import { Request, Response } from "express";
import { Trade } from "../model/trade";

const closeOrder = asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log("here");

    const { pl, orderId } = req.body;
    console.log(req.body);

    if (!orderId) {
      throw new ApiError("OrderId required....!", 401);
    }
    const order = await Trade.findById(orderId);
    order.pl = Number(pl);
    order.status = "closed";
    await order.save();
    console.log(order);

    res.json(new ApiResponse(202, "order closed", {}));
    return;
  } catch (error: any) {
    console.log(error);

    throw new ApiError(error.message || "Closing Order Error", 501);
  }
});
const fetchOpenOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"];
  try {
    if (!userId) {
      throw new ApiError("userId required...!", 401);
    }
    const orders = await Trade.find({
      userId,
      status: { $in: ["pending", "filled"] },
    }).sort({ createdAt: -1 });
    res.json(new ApiResponse(201, "trade fetched", { orders }));
  } catch (error: any) {
    throw new ApiError(error?.message || "something went wrong", 401);
  }
});
const fetchClosedOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"];
  try {
    if (!userId) {
      throw new ApiError("userId required...!", 401);
    }
    const orders = await Trade.find({ userId, status: "closed" });
    res.json(new ApiResponse(201, "trade fetched", { orders }));
  } catch (error: any) {
    throw new ApiError(error?.message || "something went wrong", 401);
  }
});

export { closeOrder, fetchOpenOrders, fetchClosedOrders };
