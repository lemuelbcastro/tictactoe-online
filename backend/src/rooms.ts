import { randomBytes } from "crypto";

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

  const roomId = randomBytes(4).toString("hex");
  const room: Room = {
    roomId,
    host: playerId,
    clients: [playerId],
    ready: false,
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

  join(room, playerId);

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
  room.ready = room.clients.length === MAX_PLAYERS;

  return room;
};

export const startRoom = (roomId: string, playerId: string) => {
  const room = getRoom(roomId);

  if (room.started) {
    throw Error("Room was already started");
  }

  start(room, playerId);

  return room;
};

export const restartRoom = (roomId: string, playerId: string) => {
  const room = getRoom(roomId);

  if (!room.ended) {
    throw Error("Room was has not yet ended");
  }

  start(room, playerId);

  return room;
};

export const reconnectRoom = (roomId: string, playerId: string) => {
  const room = getRoom(roomId);
  const { started, clients, game } = room;

  if (!game || !started) {
    throw Error("Room was has not yet started");
  }

  if (clients.includes(playerId)) {
    throw Error("Player already in the room");
  }

  if (!Object.values(game.players).includes(playerId)) {
    throw Error("Player not in the game");
  }

  join(room, playerId);

  return room;
};

const start = (room: Room, playerId: string) => {
  if (room.host !== playerId) {
    throw Error("Room can only be started by the host");
  }

  if (room.clients.length !== MAX_PLAYERS) {
    throw Error("Room must have enough players");
  }

  const random = Math.random() < 0.5;
  const [first, second] = room.clients;

  room.ended = false;
  room.started = true;
  room.game = {
    board: Array(9).fill(null) as Board,
    players: {
      X: random ? first : second,
      O: random ? second : first,
    },
    turn: "X",
  };
};

const join = (room: Room, playerId: string) => {
  if (playerExists(playerId)) {
    throw Error("Player already in a room");
  }

  if (room.clients.length === MAX_PLAYERS) {
    throw Error("Room already full");
  }

  room.clients = [...room.clients, playerId];
  room.ready = room.clients.length === MAX_PLAYERS;
};
