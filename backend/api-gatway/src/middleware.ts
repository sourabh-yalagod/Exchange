import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "@sourabhyalagod/helper";

const JWT_SECRET = process.env.JWT_SECRET || "SECRETE";

export const handleAuth = (req: any, res: Response, next: NextFunction) => {
  try {
    const rawCookie = req.headers.cookie;
    if (!rawCookie) throw new ApiError("Not authenticated", 401);

    // Extract token from cookie string
    const cookies = Object.fromEntries(
      rawCookie.split("; ").map((cookie: string) => {
        const [name, value] = cookie.split("=");
        return [name, value];
      })
    );

    const token = cookies["token"];
    if (!token) throw new ApiError("Token missing", 401);

    // Securely verify token
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    if (!payload?.userId) throw new ApiError("Invalid token", 401);
    console.log("payload : ", payload);

    req.userId = payload.userId;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    throw new ApiError("Please login to continue", 401);
  }
};
