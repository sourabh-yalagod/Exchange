import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import { ApiError, ApiResponse } from "@sourabhyalagod/helper";
import { RedisManger } from "./config/RedisManager";
import axios from "axios";
import { randomUUID } from "crypto";
import { handleProxy } from "./utils/proxy";
import { handleAuth } from "./middleware";
config();

const port = process.env.PORT || 3001;
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, //
  }),
);
app.use(express.json());
app.get("/testing", async (req: any, res) => {
  const payload = await RedisManger.getInstace().getCache(req.userId);
  res.json({payload});
});
app.post("/api/order", handleAuth, async (req: any, res) => {
  const { price, quantity, userId, asset, side, type,margin } = req.body;
  if (!price || !quantity || !asset || !side || !type||!margin) {
    throw new ApiError(401, "All fields are required....!");
  }
  const orderId = randomUUID();
  const order = {
    userId: req.userId || userId,
    price,
    quantity,
    asset,
    side,
    orderId,
    type,margin
  };
  const userMetaDataRaw = await RedisManger.getInstace().getCache(req.userId);
  console.log(userMetaDataRaw);
  
  const userMetaData = JSON.parse(userMetaDataRaw as string)
  if(userMetaData?.balance<margin){
    if(userMetaData.balance==0){
      throw new ApiError(`You have Rs0 balance left with....!`)
    }
    throw new ApiError(`You need Rs.${margin-userMetaData.balance} to execute order....!`)
  }
  if(!userMetaData){
    throw new ApiError(`User Meta data not Found Please signin once again...!`)
  }
  if (type == "market") {
    try {
      const { data } = await axios.post(
        `${process.env.EXCHANGE_ENGINE_BASE_URL!}`,
        order,
      );
      if (data.success) {
        await RedisManger.getInstace().setCache(req.userId,JSON.stringify(
        {...userMetaData,balance:Number(userMetaData.balance)-Number(margin)
        }));
        res.json(new ApiResponse(201, data.message, data.filledOrder));
      } else {
        throw new ApiError(data.message, 4, 1);
      }
      return;
    } catch (error: any) {
      throw new ApiError(error?.message || "order placed gone wrong", 501);
    }
  } else {
    console.log("limit order");

    try {
      await RedisManger.getInstace().queue(
        `order-queue`,
        JSON.stringify(order),
      );
      await RedisManger.getInstace().setCache(req.userId,JSON.stringify({...userMetaData,balance:Number(userMetaData.balance)-Number(margin),locked:userMetaData?.locked+Number(margin)}));
      res.json(
        new ApiResponse(
          201,
          `${order.quantity} quantity placed for price ${order.price}. Please confirm the orderBook`,
          {},
        ),
      );
    } catch (error) {
      throw new ApiError("order placed gone wrong" + error, 501);
    }
  }
});

app.use(
  "/api/database",
  handleAuth,
  handleProxy(process.env.EXCHANGE_DATABASE_BASE_URL as string),
);
app.use(
  "/api/user",
  handleProxy(process.env.EXCHANGE_DATABASE_BASE_URL as string),
);

app.use(
  "/api/payment",
  handleAuth,
  handleProxy(process.env.EXCHANGE_PAYMENT_BASE_URL as string),
);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.message) {
    res.json({ message: error.message || "Error from Server", sucess: false });
  } else {
    res.json({ message: "Error from Server", sucess: false });
  }
});

app.use((req, res, next) => {
  res.json({ message: `${req.url} End point not Exist...!` });
  return;
});

app.listen(port, () => {
  console.log(`Api Gatway Running on : ${port}`);
});
