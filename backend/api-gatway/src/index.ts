import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import { ApiError, ApiResponse } from "@sourabhyalagod/helper";
import { RedisManger } from "./config/RedisManager";
config();

const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/testing", async (req, res) => {
  res.json({ message: "test succuessfull." });
});
app.post("/order", async (req, res) => {
  const { price, quantity, userId, asset, side, orderId, type } = req.body;
  if (!price || !quantity || !userId || !asset || !side || !type) {
    res.json(new ApiError(401, "All fields are required....!"));
    return;
  }
  const order = { userId, price, quantity, asset, side, orderId, type };
  try {
    await RedisManger.getInstace().queue(`order-queue`, JSON.stringify(order));
    res.json(new ApiResponse(202, "order placed", {}));
    return;
  } catch (error) {
    throw new ApiError("order placed gone wrong" + error, 501);
  }
});
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.message) {
    res.json({ message: error.message || "Error from Server", sucess: false });
  } else {
    res.json({ message: "Error from Server", sucess: false });
  }
  return;
});
app.listen(port, () => {
  console.log(`Api Gatway Running on : ${port}`);
});
