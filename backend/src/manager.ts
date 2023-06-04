import { parse } from "url";
import { Server, WebSocket } from "ws";

import { Message } from "./types";
import {
  handleCreate,
  handleJoin,
  handleLeave,
  handleDisconnect,
  clients,
  handleStart,
  handleMove,
  handleRestart,
  handleReconnect,
} from "./handlers";
import { messageSchema } from "./schemas";
import {
  CREATE,
  JOIN,
  LEAVE,
  MOVE,
  RECONNECT,
  RESTART,
  START,
} from "./constants";

export const createManager = (wss: Server<WebSocket>) => {
  wss.on("error", console.error);

  wss.on("connection", (ws, req) => {
    const { query } = parse(req.url!, true);
    let playerId = query.playerId as string;

    if (!playerId) {
      ws.send(
        JSON.stringify({ type: "error", message: "Player ID not provided" }),
        () => ws.close(1003)
      );
    }

    if (clients.has(playerId)) {
      playerId = "";
      ws.send(
        JSON.stringify({ type: "error", message: "Player already connected" }),
        () => ws.close(1003)
      );
    }

    clients.set(playerId, ws);

    ws.on("message", (data: string) => {
      try {
        const message = JSON.parse(data) as Message;

        messageSchema.validateSync(message);

        const { type, payload } = message;

        switch (type) {
          case CREATE:
            handleCreate(playerId);
            break;
          case JOIN:
            handleJoin(payload.roomId, playerId);
            break;
          case LEAVE:
            handleLeave(payload.roomId, playerId);
            break;
          case MOVE:
            handleMove(payload.roomId, playerId, payload.boardIndex!);
            break;
          case RECONNECT:
            handleReconnect(payload.roomId, playerId);
            break;
          case RESTART:
            handleRestart(payload.roomId, playerId);
            break;
          case START:
            handleStart(payload.roomId, playerId);
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
        clients.delete(playerId);
      }
    });
  });
};
