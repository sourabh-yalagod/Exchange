import Redis from "ioredis";
import { User } from "../model/user";
import {
  handleTransaction,
  recordDepositeRecord,
  recordTrade,
} from "./dbOperation";

export class RedisManager {
  private static instance: RedisManager | null = null;
  private redisClient: Redis | null = null;
  private cacheClient: Redis | null = null;
  private constructor() {
    this.cacheClient = new Redis();
    this.redisClient = new Redis();
  }
  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }
  public async listenToQueue() {
    if (!this.redisClient) {
      this.redisClient = new Redis({ port: 6379 });
    }
    while (true) {
      const [key, data]: [string, string] | any = await this.redisClient.brpop(
        ["database", "trades", "order"],
        0
      );
      console.log(data);

      if (key == "database") {
        const value = JSON.parse(data);
        switch (value?.title) {
          case "depositeRecord":
            await recordDepositeRecord(value);
            break;
          case "recordTrade":
            try {
              await recordTrade(value);
            } catch (error) {
              console.log("DB Error : ", error);
            }
            break;
          default:
            console.log("Queue title not listened");
        }
      }
      if (key == "order" && data) {
        console.log("Order : ", data);
        try {
          await recordTrade(JSON.parse(data));
        } catch (error) {
          console.error(error);
        }
      }
      if (key == "trades") {
        const payload = JSON.parse(data);
        try {
          await handleTransaction(payload);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
  public async cacheManager(key: string, payload: string) {
    if (!this.cacheClient) {
      this.cacheClient = new Redis();
    }
    try {
      return await this.cacheClient?.set(key, payload);
    } catch (error) {
      throw new Error(`Session management failed while caching in redis`);
    }
  }
}
