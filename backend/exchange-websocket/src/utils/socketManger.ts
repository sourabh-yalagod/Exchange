import { WebSocket } from "ws";
import { RedisManger } from "./RedisManger";
export class WebSockerManager {
  private static instance: WebSockerManager | null = null;
  private constructor() {}
  private subscriptionSockets = new Map<string, WebSocket[]>();
  public static getInstance() {
    if (!this.instance) {
      this.instance = new WebSockerManager();
    }
    return this.instance;
  }
  handleSocket(ws: WebSocket) {
    ws.on("message", (data) => {
      const { event } = JSON.parse(data.toString());
      const { subscribe } = JSON.parse(data.toString());

      if (this.subscriptionSockets.has(subscribe)) {
        const subscriptionSockets = this.subscriptionSockets.get(subscribe);
        subscriptionSockets?.push(ws);
        this.subscriptionSockets.set(subscribe, subscriptionSockets || []);
      } else {
        console.log("first to ", subscribe);
        this.subscriptionSockets.set(subscribe, [ws]);
      }
      switch (event) {
        case "SUBSCRIBE":
          RedisManger.getInstace().subscibeChannel(subscribe);
          break;
        case "PUBSUBEVENTS":
          RedisManger.getInstace().PubSubMessages(
            subscribe,
            this.subscriptionSockets.get(subscribe) || []
          );
          break;
      }
    });
    ws.on("close", (ws: WebSocket) => {
      const topic = "BTC";
      const remainingSockets = this.subscriptionSockets
        .get(topic)
        ?.filter((socket) => socket != ws);

      console.log("remainingSockets:", remainingSockets?.length);

      if (!remainingSockets?.length) {
        RedisManger.getInstace().unSubscribeChannel(topic);
      }

      this.subscriptionSockets.set(topic, remainingSockets || []);
      console.log("connection Closed");
    });
  }
}
