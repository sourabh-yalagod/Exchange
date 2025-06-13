import Redis from "ioredis";
import { ApiError } from "@sourabhyalagod/helper";
export class RedisManger {
  public static instance: RedisManger;
  private redisClient: Redis | null = null;

  private constructor() {
    this.redisClient = new Redis({ port: 6379, host: "localhost" });
  }

  public static getInstace() {
    if (!this.instance) {
      this.instance = new RedisManger();
    }
    return this.instance;
  }

  async queue(key: string, value: string) {
    try {
      await this.redisClient?.lpush(key, value);
    } catch (error) {
      throw new ApiError("order is pused to Redis Queue " + error, 501);
    }
  }
  async manageCache(key: string, value: string) {
    try {
      await this.redisClient?.set(key, value);
    } catch (error) {
      throw new ApiError("order is pused to Redis Queue " + error, 501);
    }
  }
}
