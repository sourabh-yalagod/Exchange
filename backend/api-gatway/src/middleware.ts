import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
export const handleAuth = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.cookie || req.headers.authorization?.split(" ")[1];
  const filteredToken = token?.split("token=")[1];

  const payload: any = jwt.decode(filteredToken || "");
  console.log(payload);

  req.userId = payload?.userId || null;

  next();
};
