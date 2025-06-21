import express, { NextFunction, Request, Response } from "express";
const app = express();
app.use(express.json());

import authRouter from "./router/userRouter";
import userTrades from "./router/tradeRouter";
import orderBookRouter from "./router/orderBookRouter";
import { MongoManager } from "./database/mongoDB";
import { RedisManager } from "./utils/RedisManager";

const port = process.env.PORT || 3004;
MongoManager.getInstance().mongoDb();
RedisManager.getInstance().listenToQueue();

app.use("/auth", authRouter);
app.use("/order", userTrades);
app.use('/orderBook',orderBookRouter)
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.message) {
    res.json({ message: error.message, success: false });
    return;
  }
  res.json({ message: "User Internal server Error", success: false });
  return;
});
app.listen(port, () => {
  console.log(`User service on PORT Running : ${port}`);
});
