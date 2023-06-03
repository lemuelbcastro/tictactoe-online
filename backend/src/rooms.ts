import { v4 as uuidv4 } from "uuid";

import { Game, Room } from "./types";

export const rooms = new Map<string, Room>();

export const playerExists = (playerId: string) =>
  Array.from(rooms).some(([, { players }]) => players.includes(playerId));

export const createRoom = (playerId: string): Room => {
  if (playerExists(playerId)) {
    throw Error("Player already in a room");
  }

  const roomId = uuidv4();
  const room: Room = {
    roomId,
    host: playerId,
    players: [playerId],
    started: false,
    ended: false,
  };

  rooms.set(roomId, room);

  return room;
};

export const joinRoom = (roomId: string, playerId: string) => {
  const room = rooms.get(roomId);

  if (!room) {
    throw Error("Room does not exist");
  }

  if (playerExists(playerId)) {
    throw Error("Player already in a room");
  }

  rooms.set(roomId, { ...room, players: [...room.players, playerId] });

  return rooms.get(roomId);
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

  return rooms.get(roomId);
};

export const startRoom = (roomId: string, playerId: string) => {
  const room = rooms.get(roomId);

  if (!room) {
    throw Error("Room does not exist");
  }

  if (room.host !== playerId) {
    throw Error("Room can only be started by the host");
  }

  const game: Game = {
    board: Array<string | null>(9).fill(null),
    turn: "X",
  };

  rooms.set(roomId, { ...room, game, started: true });

  return rooms.get(roomId);
};
