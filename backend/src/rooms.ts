import { v4 as uuidv4 } from "uuid";

import { Room } from "./types";

const rooms = new Map<string, Room>();

export const playerExists = (playerId: string) =>
  Array.from(rooms).some(([, { players }]) => players.includes(playerId));

export const createRoom = (playerId: string): Room => {
  if (playerExists(playerId)) {
    throw Error("Player already exists");
  }

  const roomId = uuidv4();
  const room = { roomId, players: [playerId] };

  rooms.set(roomId, room);

  return room;
};

export const joinRoom = (roomId: string, playerId: string) => {
  const room = rooms.get(roomId);

  if (!room) {
    throw Error("Room does not exist");
  }

  if (playerExists(playerId)) {
    throw Error("Player already exists");
  }

  rooms.set(roomId, { ...room, players: [...room.players, playerId] });
};

export const leaveRoom = (roomId: string, playerId: string) => {
  const room = rooms.get(roomId);

  if (!room) {
    throw Error("Room does not exist");
  }

  if (!room.players.includes(playerId)) {
    throw Error("Player not in room");
  }

  if (room.players.length === 1) {
    rooms.delete(roomId);

    return;
  }

  const players = room.players.filter((player) => player !== playerId);

  rooms.set(roomId, { ...room, players });
};

export const leaveAllRooms = (playerId: string) => {
  rooms.forEach(({ roomId, players }) => {
    if (players.includes(playerId)) {
      leaveRoom(roomId, playerId);
    }
  });
};
