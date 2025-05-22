class SocketManager {
  private instance: WebSocket | null = null;
  private constructor() {
    this.instance = new WebSocket(``);
  }
}
