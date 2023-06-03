import { WebSocket } from "ws";

import { createRoom, joinRoom, leaveRoom, rooms } from "./rooms";

export const players = new Map<string, WebSocket>();

export const broadcastMessage = (roomId: string, message: string) => {
  rooms.get(roomId)?.players.forEach((playerId) => {
    const player = players.get(playerId);
    player?.send(message);
  });
};

export const handleCreate = (playerId: string) => {
  const room = createRoom(playerId);

  broadcastMessage(
    room.roomId,
    JSON.stringify({ message: `${room.roomId} created by ${playerId}`, room })
  );
};

export const handleJoin = (roomId: string, playerId: string) => {
  joinRoom(roomId, playerId);
  broadcastMessage(roomId, JSON.stringify({ message: `${playerId} joined` }));
};

export const handleLeave = (roomId: string, playerId: string) => {
  leaveRoom(roomId, playerId);
  broadcastMessage(roomId, JSON.stringify({ message: `${playerId} left` }));
};

export const handleDisconnect = (playerId: string) => {
  rooms.forEach(({ roomId, players }) => {
    if (players.includes(playerId)) {
      handleLeave(roomId, playerId);
    }
  });
  players.delete(playerId);
};
