import { asyncHandler, ApiError, ApiResponse } from "@sourabhyalagod/helper";
import { Response } from "express";
import { User } from "../model/user";

const getUserInfo = asyncHandler(async (req: any, res: Response) => {
  try {
    const userId = req?.userId
    const user = await User.findOne({userId})
    res.json(new ApiResponse(201, "user created",user));
  } catch (error:any) {
    throw new ApiError(error?.message ?? `user fetching failed....!`,501)
  }
  return;
});


export { getUserInfo };
