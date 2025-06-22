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
      switch (event) {
        case "SUBSCRIBE":
          RedisManger.getInstace().PubSubMessages(
            subscribe,
            this.subscriptionSockets.get(subscribe) || [],
          );
          break;
      }
      if(this.subscriptionSockets.get(subscribe)){
        const existingSocket = this.subscriptionSockets.get(subscribe)
        if(!existingSocket?.includes(ws)){
          existingSocket?.push(ws)
          console.log('ExistingSocket',existingSocket?.length);
        }else{
          console.log('socket exist');
          console.log('ExistingSocket',existingSocket?.length);
        }
        this.subscriptionSockets.set(subscribe,existingSocket as WebSocket[])
      }else{
        console.log('First socket');
        this.subscriptionSockets.set(subscribe,[ws])
      }
    });
    ws.on("close", (ws: number) => {
      const topic = "BTCUSDT";
      const sockets = this.subscriptionSockets.get(topic);

      console.log("Before Length : ", sockets?.length);

      if (sockets) {
        const remainingSockets = sockets.filter((socket:any) => socket?._closeCode!=ws);

        // Update the map
        this.subscriptionSockets.set(topic, remainingSockets);

        // Corrected logs
        console.log("After Length : ", remainingSockets.length);

        if (remainingSockets.length === 0) {
          RedisManger.getInstace().unSubscribeChannel(topic);
        }
      }
    });

  }
}
