import Redis from "ioredis";
import { User } from "../model/user";
import { recordDepositeRecord, recordTrade } from "./dbOperation";

export class RedisManager {
  private static instance: RedisManager | null = null;
  private queue: Redis | null = null;
  private constructor() {}
  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }
  public async listenToQueue() {
    if (!this.queue) {
      this.queue = new Redis({ port: 6379 });
    }
    while (true) {
      const response = await this.queue.brpop("database", 0);
      if (response) {
        const value = JSON.parse(response[1]);
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
    }
  }
}
