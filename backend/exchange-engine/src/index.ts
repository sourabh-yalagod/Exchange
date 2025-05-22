import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import redis from "./config/RediManager";
import { Engine } from "./utils/exchangeEngine";
import { ApiError } from "@sourabhyalagod/helper";
config();
const app = express();

redis.on("connect", () => {
  orderQueue();
});
redis.on("error", (error: any) => {
  throw new ApiError(501, error.message);
});

async function orderQueue() {
  while (true) {
    const [key, payload]: [string, string] | any = await redis.brpop(
      "order-queue",
      0
    );
    if (key && payload) {
      Engine.getInstance().process(JSON.parse(payload));
    }
  }
}
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.message) {
    res.json({ message: error.message, success: false });
    return;
  }
  res.json({ message: "Internal server Error", success: false });
});
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Exchange Engine Running on :${port}`);
});
