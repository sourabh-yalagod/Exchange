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
      const { event, subscribe } = JSON.parse(data.toString());
      console.log("Event ", { event, subscribe });
      if (this.subscriptionSockets.has(subscribe)) {
        const subscriptionSockets = this.subscriptionSockets.get(subscribe);
        if (subscriptionSockets && !subscriptionSockets.includes(ws)) {
          subscriptionSockets.push(ws);
        }
      } else {
        this.subscriptionSockets.set(subscribe, [ws]);
      }
      switch (event) {
        case "SUBSCRIBE":
          RedisManger.getInstace().PubSubMessages(
            subscribe,
            this.subscriptionSockets.get(subscribe) || [],
          );
          break;
      }
    });
    ws.on("close", (ws: WebSocket) => {
      const topic = "BTCUSDT";
      const sockets = this.subscriptionSockets.get(topic);
      if (sockets) {
        const remainingSockets = sockets.filter((socket) => socket !== ws);
        this.subscriptionSockets.set(topic, remainingSockets);
        console.log("Remaining sockets:", remainingSockets.length);
        
        console.log("Connection closed");
        console.log(this.subscriptionSockets);
        
        if (!remainingSockets?.length) {
          RedisManger.getInstace().unSubscribeChannel(topic);
        }
      }
    });
  }
}
