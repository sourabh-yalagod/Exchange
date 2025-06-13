import { asyncHandler, ApiError, ApiResponse } from "@sourabhyalagod/helper";
import { config } from "dotenv";
import { Request, Response } from "express";
import { Stripe } from "stripe";
import { zodDepositeRecord } from "../../types";
import { RedisManger } from "../utils/RedisManager";
import Razorpay from "razorpay";
const razerPay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
config();
const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY!);
const createIntent = asyncHandler(async (req: any, res: Response) => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    throw new ApiError(`please authenticate..!`);
  }
  console.log("userId", userId);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req?.body?.amount || 100,
      currency: "usd",
      description: "Deposite to Exchage Account",
      metadata: {
        userId: req?.userId as string,
      },
      shipping: {
        name: "Jenny Rosen",
        address: {
          line1: "510 Townsend St",
          postal_code: "98140",
          city: "San Francisco",
          state: "CA",
          country: "US",
        },
      },
    });
    res.json(
      new ApiResponse(205, "stripe created payment intent", {
        provider: "stripe",
        client_secrete: paymentIntent.client_secret,
      })
    );
    return;
  } catch (error) {
    try {
      const razorPayIntent = await razerPay.orders.create({
        amount: req?.body?.amount,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
        payment_capture: true,
      });
      res.json(
        new ApiResponse(205, "razorpay payment intent", {
          provider: "razorpay",
          orderId: razorPayIntent.id,
        })
      );
      return;
    } catch (error) {
      throw new ApiError(501, "all the payment services are down...!");
    }
  }
});

const depositeRecord = asyncHandler(async (req: Request, res: Response) => {
  const { data, success, error } = zodDepositeRecord.safeParse(req.body);
  const userId = req.headers["x-user-id"];
  if (!userId) {
    throw new ApiError(`please authenticate..!`);
  }
  console.log({ data, success, error });

  if (!success) {
    throw new ApiError(error.message, 401);
  }
  try {
    await RedisManger.getInstace().queue(
      "database",
      JSON.stringify({ ...data, userId, title: "depositeRecord" })
    );
    await RedisManger.getInstace().manageCache(
      userId as string,
      JSON.stringify(data.amount)
    );
    res.json(new ApiResponse(201, "Added to Queue", data));
    return;
  } catch (error: any) {
    console.log(error);

    throw new ApiError(error.message, 401);
  }
});

export { createIntent, depositeRecord };
