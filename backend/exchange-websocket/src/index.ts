import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import { WebSockerManager } from "./utils/socketManger";
import { config } from "dotenv";
config()
const app = express();
const server = http.createServer(app);

export const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => WebSockerManager.getInstance().handleSocket(ws));
const port = process.env.PORT || 3005;
console.log(port);

server.listen(port, () => {
  console.log(`websocket running on PORT : ${port}`);
});
