import { z } from "zod";

export const zodUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).default("user"),

  token: z.string().optional(),
  balance: z.number().optional().default(0),

  trades: z.array(z.string().optional()).optional(),

  depositHistory: z
    .array(
      z.object({
        amount: z.number(),
        method: z.string(),
        status: z.enum(["pending", "completed", "failed"]).default("pending"),
        createdAt: z.date().optional(),
      }),
    )
    .optional(),

  withdrawalHistory: z
    .array(
      z.object({
        amount: z.number(),
        method: z.string(),
        address: z.string(),
        status: z.enum(["pending", "approved", "rejected"]).default("pending"),
        createdAt: z.date().optional(),
      }),
    )
    .optional(),
});
export const zodLoginSchema = z.object({
  username: z.string().min(1, "Username is must not be empty"),
  password: z.string().min(1, "Username is must not be empty"),
});
