import { z } from "zod";

const zodPaymentIntent = z.object({
  amount: z.number(),
});
const zodDepositeRecord = z.object({
  amount: z.number(),
  method: z.string(),
  status: z.enum(["pending", "completed", "failed"]),

  createdAt: z.date().optional(),
});

export { zodDepositeRecord };
