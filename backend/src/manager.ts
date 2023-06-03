import { parse } from "url";
import { Server, WebSocket } from "ws";

import { Payload } from "./types";
import {
  handleCreate,
  handleJoin,
  handleLeave,
  handleDisconnect,
  clients,
  handleStart,
  handleMove,
} from "./handlers";

export const createManager = (wss: Server<WebSocket>) => {
  wss.on("error", console.error);

  wss.on("connection", (ws, req) => {
    const { query } = parse(req.url!, true);
    const playerId = query.playerId as string;

    if (!playerId || clients.has(playerId)) {
      ws.send(
        JSON.stringify({ type: "error", message: "Player already connected" }),
        () => ws.close()
      );
    }

    clients.set(playerId, ws);

    ws.on("message", (data: string) => {
      try {
        const { type, params } = JSON.parse(data) as Payload;

        switch (type) {
          case "create":
            handleCreate(playerId);
            break;
          case "join":
            handleJoin(params.roomId, playerId);
            break;
          case "leave":
            handleLeave(params.roomId, playerId);
            break;
          case "start":
            handleStart(params.roomId, playerId);
            break;
          case "move":
            handleMove(params.roomId, playerId, params.boardIndex);
            break;

          default:
            break;
        }
      } catch (error) {
        console.error(error);
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
