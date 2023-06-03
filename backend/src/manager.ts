import { parse } from "url";
import { Server, WebSocket } from "ws";

import { Payload } from "./types";
import {
  handleCreate,
  handleJoin,
  handleLeave,
  handleDisconnect,
  players,
  handleStart,
} from "./handlers";

export const createManager = (wss: Server<WebSocket>) => {
  wss.on("error", console.error);

  wss.on("connection", (ws, req) => {
    const { query } = parse(req.url!, true);
    const playerId = query.playerId as string;

    if (!playerId || players.has(playerId)) {
      ws.send(
        JSON.stringify({ type: "error", message: "Player already connected" }),
        () => ws.close()
      );
    }

    players.set(playerId, ws);

    ws.on("message", (data: string) => {
      try {
        const {
          type,
          params: { roomId },
        } = JSON.parse(data) as Payload;

        switch (type) {
          case "create":
            handleCreate(playerId);
            break;
          case "join":
            handleJoin(roomId, playerId);
            break;
          case "leave":
            handleLeave(roomId, playerId);
            break;
          case "start":
            handleStart(roomId, playerId);
            break;

          default:
            break;
        }
      } catch (error) {
        if (error instanceof Error) {
          ws.send(JSON.stringify({ type: "error", message: error.message }));
        }
      }
    });

    ws.on("close", () => {
      if (playerId) {
        handleDisconnect(playerId);
      }
    });
  });
};
