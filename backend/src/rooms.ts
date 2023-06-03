import { v4 as uuidv4 } from "uuid";

import { Board, Room } from "./types";
import { MAX_PLAYERS } from "./constants";

export const rooms = new Map<string, Room>();

export const playerExists = (playerId: string) =>
  Array.from(rooms).some(([, { clients: players }]) =>
    players.includes(playerId)
  );

export const createRoom = (playerId: string): Room => {
  if (playerExists(playerId)) {
    throw Error("Player already in a room");
  }

  const roomId = uuidv4();
  const room: Room = {
    roomId,
    host: playerId,
    clients: [playerId],
    started: false,
    ended: false,
  };

  rooms.set(roomId, room);

  return room;
};

export const getRoom = (roomId: string) => {
  const room = rooms.get(roomId);

  if (!room) {
    throw Error("Room does not exist");
  }

  return room;
};

export const joinRoom = (roomId: string, playerId: string) => {
  const room = getRoom(roomId);

  if (playerExists(playerId)) {
    throw Error("Player already in a room");
  }

  if (room.clients.length === MAX_PLAYERS) {
    throw Error("Room already full");
  }

  room.clients = [...room.clients, playerId];

  rooms.set(roomId, room);

  return room;
};

export const leaveRoom = (roomId: string, playerId: string) => {
  const room = getRoom(roomId);

  if (!room.clients.includes(playerId)) {
    throw Error("Player not in room");
  }

  if (room.clients.length === 1) {
    rooms.delete(roomId);

    return room;
  }

  room.clients = room.clients.filter((player) => player !== playerId);

  rooms.set(roomId, room);

  return room;
};

export const startRoom = (roomId: string, playerId: string) => {
  const room = getRoom(roomId);

  if (room.host !== playerId) {
    throw Error("Room can only be started by the host");
  }

  if (room.clients.length !== MAX_PLAYERS) {
    throw Error("Room must have enough players");
  }

  const random = Math.random() < 0.5;
  const [first, second] = room.clients;

  room.started = true;
  room.game = {
    board: Array(9).fill(null) as Board,
    players: {
      X: random ? first : second,
      O: random ? second : first,
    },
    turn: "X",
  };

  rooms.set(roomId, room);

  return room;
};
