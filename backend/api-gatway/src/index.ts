import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import { ApiError, ApiResponse } from "@sourabhyalagod/helper";
import { RedisManger } from "./config/RedisManager";
import proxy from "express-http-proxy";
import { handleAuth, handleRedisQueue } from "./middleware";
import axios from "axios";
config();

const port = process.env.PORT || 3001;
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(handleAuth);

app.post("/api/order", async (req: any, res) => {
  const { price, quantity, userId, asset, side, orderId, type } = req.body;
  if (!price || !quantity || !asset || !side || !type) {
    throw new ApiError(401, "All fields are required....!");
  }
  console.log("Order reached...!");

  const order = {
    userId: req.userId,
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
      console.log(data);

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
  proxy(process.env.EXCHANGE_DATABASE_BASE_URL as string, {
    proxyReqOptDecorator(proxyReqOpts: any, srcReq: any) {
      if (srcReq.userId) {
        proxyReqOpts.headers["x-user-id"] = srcReq.userId;
      }
      if (srcReq.headers.authorization) {
        proxyReqOpts.headers["authorization"] = srcReq.headers.authorization;
      }

      return proxyReqOpts;
    },
    proxyErrorHandler(err, res, next) {
      next(new ApiError(err?.message || err, 401));
    },
  })
);
app.use(
  "/api/user",
  proxy(process.env.EXCHANGE_DATABASE_BASE_URL as string, {
    proxyErrorHandler(err, res, next) {
      throw new ApiError(err, 401);
    },
  })
);
app.use(
  "/api/payment",
  proxy(process.env.EXCHANGE_PAYMENT_BASE_URL!, {
    proxyErrorHandler(err, res, next) {
      next(new ApiError(err?.message || err, 401));
    },
  })
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
