import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import { ApiError, ApiResponse } from "@sourabhyalagod/helper";
import { RedisManger } from "./config/RedisManager";
import proxy from "express-http-proxy";
import { handleAuth } from "./middleware";
import axios from "axios";
import { randomUUID } from "crypto";
import { handleProxy } from "./utils/proxy";
config();

const port = process.env.PORT || 3001;
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, //
  })
);
app.use(express.json());
app.use(handleAuth);
app.get("/testing", async (req: any, res) => {
  const payload = await RedisManger.getInstace().getCache(req.userId);
  res.json(payload);
});
app.post("/api/order", async (req: any, res) => {
  const { price, quantity, userId, asset, side, type } = req.body;
  if (!price || !quantity || !asset || !side || !type) {
    throw new ApiError(401, "All fields are required....!");
  }
  console.log("Order reached...!");
  const orderId = randomUUID();
  const order = {
    userId: req.userId || userId,
    price,
    quantity,
    asset,
    side,
    orderId,
    type,
  };
  if (type == "market") {
    try {
      const { data } = await axios.post(
        `${process.env.EXCHANGE_ENGINE_BASE_URL!}`,
        order
      );
      res.json(new ApiResponse(201, data.message, data.filledOrder));
      return;
    } catch (error) {
      throw new ApiError("order placed gone wrong" + error, 501);
    }
  } else {
    try {
      await RedisManger.getInstace().queue(
        `order-queue`,
        JSON.stringify(order)
      );
      res.json(
        new ApiResponse(
          201,
          `${order.quantity} quantity placed for price ${order.price}. Please confirm the orderBook`,
          {}
        )
      );
    } catch (error) {
      throw new ApiError("order placed gone wrong" + error, 501);
    }
  }
});

app.use(
  "/api/database",
  handleProxy(process.env.EXCHANGE_DATABASE_BASE_URL as string)
);
app.use(
  "/api/user",
  handleProxy(process.env.EXCHANGE_DATABASE_BASE_URL as string)
);
app.use(
  "/api/payment",
  handleProxy(process.env.EXCHANGE_PAYMENT_BASE_URL as string)
);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.message) {
    res.json({ message: error.message || "Error from Server", sucess: false });
  } else {
    res.json({ message: "Error from Server", sucess: false });
  }
  next();
});

app.use((req, res, next) => {
  res.json({ message: `${req.url} End point not Exist...!` });
  return;
});

app.listen(port, () => {
  console.log(`Api Gatway Running on : ${port}`);
});
