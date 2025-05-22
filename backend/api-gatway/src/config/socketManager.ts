import { WebSocket } from "ws";
import { ApiError } from "@sourabhyalagod/helper";

export class SocketManager {
  private static instance: SocketManager | null = null;
  private socketClientSet = new Set<WebSocket>();

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new SocketManager();
    }
    return this.instance;
  }

  public handleConnection(ws: WebSocket) {
    this.socketClientSet.add(ws);

    ws.on("close", () => {
      console.log("Client disconnected.");
      this.socketClientSet.delete(ws);
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
      this.socketClientSet.delete(ws);
    });
  }

  public broadcast(data: any) {
    const message = JSON.stringify(data);
    for (const client of this.socketClientSet) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}
