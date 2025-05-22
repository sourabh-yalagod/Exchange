import Redis from "ioredis";
import { WebSocket } from "ws";
import { ApiError } from "@sourabhyalagod/helper";
export class RedisManger {
  public static instance: RedisManger;
  private subscriber: Redis | null = null;
  private redisQueue: Redis | null = null;
  private listenersMap = new Map<string, (message: string) => void>();
  private constructor() {
    this.subscriber = new Redis({ port: 6379, host: "localhost" });
    this.redisQueue = new Redis({ port: 6379, host: "localhost" });
  }
  private subscriptionSet: Set<string> = new Set();
  public static getInstace() {
    if (!this.instance) {
      this.instance = new RedisManger();
    }
    return this.instance;
  }
  public async subscibeChannel(channel: string = "BTC") {
    if (this.subscriptionSet.has(channel)) return;
    try {
      await this.subscriber?.subscribe(channel);
      this.subscriptionSet.add(channel);
    } catch (error) {
      this.subscriptionSet.delete(channel);
      throw new ApiError(
        401,
        `PubSub Channel Subscription Error [${channel}] : ERORR-> ` + error
      );
    }
  }
  public async PubSubMessages(channel: string, sockets: WebSocket[]) {
    await this.subscibeChannel(channel);
    if (!this.listenersMap.has(channel)) {
      const handler = (chan: string, message: string) => {
        if (chan === channel) {
          console.log(`Pub Sub Event : ${message}`);
          sockets?.forEach((socket) => {
            socket.send(message);
          });
        }
      };

      this.subscriber?.on("message", (channel, data) => handler(channel, data));
      this.listenersMap.set(channel, () => handler);
    }
  }
  public async unSubscribeChannel(channel: string) {
    try {
      await this.subscriber?.unsubscribe(channel);
    } catch (error) {
      throw new ApiError(
        401,
        `PubSub Channel UnSubscribe Error [${channel}] : ERORR-> ` + error
      );
    }
  }
  async queue(key: string, value: string) {
    await this.redisQueue?.lpush(key, value);
  }
}
