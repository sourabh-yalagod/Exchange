import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

import depositeRecord from "./router/index";
app.use("/", depositeRecord);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.message) {
    res.json({ message: error.message || "Error from Server", sucess: false });
  } else {
    res.json({ message: "Error from Server", sucess: false });
  }
  return;
});
app.use((req, res, next) => {
  res.json({ message: `${req.url} End point not Exist...!` });
  next();
});
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Payment service Running on PORT : ${port}`);
});
