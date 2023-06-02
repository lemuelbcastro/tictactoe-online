import express from "express";
import { createServer } from "http";
import { parse } from "url";
import { WebSocketServer } from "ws";

import { createRoom, joinRoom, leaveAllRooms, leaveRoom } from "./rooms";
import { Payload } from "./types";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const players = new Set();

wss.on("error", console.error);

wss.on("connection", (ws, req) => {
  const { query } = parse(req.url!, true);
  const playerId = query.playerId as string;

  if (!playerId || players.has(playerId)) {
    ws.close();
  }
  players.add(playerId);

  ws.on("message", (data: string) => {
    try {
      const { type, params } = JSON.parse(data) as Payload;

      if (type === "create") {
        const room = createRoom(playerId);

        ws.send(JSON.stringify(room));
      }

      if (type === "join") {
        joinRoom(params.roomId, playerId);
      }

      if (type === "leave") {
        leaveRoom(params.roomId, playerId);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }

      ws.close();
    }
  });

  ws.on("close", () => {
    if (!playerId) {
      return;
    }

    leaveAllRooms(playerId);
  });
});

const port = process.env.PORT ?? 3000;
server.listen(port);
