import { asyncHandler, ApiError, ApiResponse } from "@sourabhyalagod/helper";
import { Request, Response } from "express";
import { User } from "../model/user";
import { zodLoginSchema, zodUserSchema } from "../types";
import { generateToken, hashPassword, verifyPassword } from "../utils";
import { RedisManager } from "../utils/RedisManager";

const register = asyncHandler(async (req: Request, res: Response) => {
  const { success, error, data } = zodUserSchema.safeParse(req.body);
  console.log({ success, error, data });

  if (!success) {
    throw new ApiError(error.message, 401);
  }

  const checkUser = await User.findOne({
    $or: [{ username: data.username }, { email: data.email }],
  });
  if (checkUser) {
    throw new ApiError(`${data.username} already exist...!`, 401);
  }

  data.password = await hashPassword(data.password);
  console.log(data);

  const newUser = await User.create(data);
  res.json(new ApiResponse(201, "user created", newUser));
  return;
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { success, data, error } = zodLoginSchema.safeParse(req.body);
  if (!success) {
    throw new ApiError(error.message, 401);
  }

  const checkUser = await User.findOne({
    $or: [{ username: data.username }],
  });
  if (!checkUser) {
    throw new ApiError(`user not exist please register`, 401);
  }
  const isPasswordValid = await verifyPassword(
    checkUser.password,
    data.password
  );
  if (!isPasswordValid) {
    throw new ApiError(`Password is invalid....!`, 401);
  }
  const token = generateToken({
    userId: checkUser.id || checkUser._id,
    username: checkUser.username,
  });
  RedisManager.getInstance().cacheManager(
    checkUser._id,
    JSON.stringify({
      balace: checkUser.balance,
      locked: checkUser?.locked || 0,
      username: checkUser.username,
      email: checkUser.email,
    })
  );

  res
    .status(202)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    })
    .json(new ApiResponse(202, "user logged successfully.", { token }));
  return;
});

export { register, login };
