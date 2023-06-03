import { WebSocket } from "ws";

import { createRoom, joinRoom, leaveRoom, rooms, startRoom } from "./rooms";

export const players = new Map<string, WebSocket>();

export const sendMessage = (playerId: string, message: string | object) => {
  const player = players.get(playerId);
  player?.send(JSON.stringify(message));
};

export const broadcastMessage = (roomId: string, message: string | object) => {
  rooms.get(roomId)?.players.forEach((playerId) => {
    sendMessage(playerId, message);
  });
};

export const handleCreate = (playerId: string) => {
  const room = createRoom(playerId);

  broadcastMessage(room.roomId, {
    type: "created",
    message: `${room.roomId} created by ${playerId}`,
    room,
  });
};

export const handleJoin = (roomId: string, playerId: string) => {
  const room = joinRoom(roomId, playerId);
  broadcastMessage(roomId, {
    type: "joined",
    message: `${playerId} joined`,
    room,
  });
};

export const handleLeave = (roomId: string, playerId: string) => {
  const room = leaveRoom(roomId, playerId);
  broadcastMessage(roomId, { type: "left", message: `${playerId} left`, room });
};

export const handleDisconnect = (playerId: string) => {
  rooms.forEach(({ roomId, players }) => {
    if (players.includes(playerId)) {
      handleLeave(roomId, playerId);
    }
  });
  players.delete(playerId);
};

export const handleStart = (roomId: string, playerId: string) => {
  const room = startRoom(roomId, playerId);

  broadcastMessage(roomId, {
    type: "started",
    message: `${roomId} started`,
    room,
  });
};
