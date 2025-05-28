import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RedisManger } from "./config/RedisManager";
export const handleAuth = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.cookie || req.headers.authorization?.split(" ")[1];
  const filteredToken = token?.split("token=")[1];

  const payload: any = jwt.decode(filteredToken || "");

  req.userId = payload?.userId || null;

  next();
};
export const handleRedisQueue = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const instance = RedisManger.getInstace();
  req.queue = instance.queue.bind(instance);
  next();
};
