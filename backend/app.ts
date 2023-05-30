import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = createServer(app);

const ws = new WebSocketServer({ server });

ws.on("error", console.error);

ws.on("connection", (ws) => {
  ws.on("message", (data) => {
    console.log("received: %s", data);
  });
});

const port = process.env.PORT ?? 3000;
server.listen(port);
