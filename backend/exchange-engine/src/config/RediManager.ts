import Redis from "ioredis";
import { ApiError } from "@sourabhyalagod/helper";
const redis = new Redis({ host: "localhost", port: 6379 });
export default redis;

export class PubSubClients {
  private subscriptionSet: Set<string> = new Set();
  private static instance: PubSubClients;
  private publisher: Redis | null = null;
  private subscriber: Redis | null = null;
  private constructor() {
    this.publisher = new Redis({ port: 6379 });
    this.subscriber = new Redis({ port: 6379 });
  }
  public static getInstance() {
    if (!this.instance) {
      this.instance = new PubSubClients();
    }
    return this.instance;
  }
  async subscribeChannel(channel: string) {
    if (this.subscriptionSet.has(channel)) return;
    try {
      await this.subscriber?.subscribe(channel);
      this.subscriptionSet.add(channel);
    } catch (error) {
      this.subscriptionSet.delete(channel);
    }
  }
  public async queue(queueName: string, payload: string) {
    await redis.lpush(queueName.toString(), payload);
  }
  async publishToChannel(channel: string, message: string) {
    try {
      await this.publisher?.publish(channel, message);
    } catch (error) {
      throw new ApiError(
        401,
        `Error from ENGINE while PUblishing to Channel : ${channel}`
      );
    }
  }
}
