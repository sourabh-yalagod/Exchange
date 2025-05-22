import express, { NextFunction, Request, Response } from "express";
import { ApiError } from "@sourabhyalagod/helper";
const app = express();
app.use(express.json());

app.use("/api/");
const port = 3004;

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
