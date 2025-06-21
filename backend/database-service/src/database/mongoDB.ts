import mongoose from "mongoose";
import { ApiError } from "@sourabhyalagod/helper";
import { config } from "dotenv";
config();
export class MongoManager {
  private static instance: MongoManager | null = null;
  private constructor() {}
  public static getInstance() {
    if (!this.instance) {
      this.instance = new MongoManager();
    }
    return this.instance;
  }
  public async mongoDb() {
    try {
      await mongoose.connect(process.env.MONGO_URL!, { dbName: "Exchange" });
      console.log("Mongo DB connected..!");
    } catch (error) {
      throw new ApiError("MongoDb Connection Failed....!", 501);
    }
  } 
}
