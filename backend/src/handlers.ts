import { WebSocket } from "ws";

import {
  createRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  rooms,
  startRoom,
} from "./rooms";
import { checkWin, move } from "./game";

export const clients = new Map<string, WebSocket>();

export const sendMessage = (playerId: string, message: string | object) => {
  const player = clients.get(playerId);
  player?.send(JSON.stringify(message));
};

export const broadcastMessage = (roomId: string, message: string | object) => {
  rooms.get(roomId)?.clients.forEach((playerId) => {
    sendMessage(playerId, message);
  });
};

export const handleCreate = (playerId: string) => {
  const room = createRoom(playerId);

  broadcastMessage(room.roomId, {
    type: "created",
    message: `Room ${room.roomId} created by player ${playerId}`,
    room,
  });
};

export const handleJoin = (roomId: string, playerId: string) => {
  const room = joinRoom(roomId, playerId);

  broadcastMessage(roomId, {
    type: "joined",
    message: `Player ${playerId} joined ${room.roomId}`,
    playerId,
    room,
  });
};

export const handleLeave = (roomId: string, playerId: string) => {
  const room = leaveRoom(roomId, playerId);

  broadcastMessage(roomId, {
    type: "left",
    message: `Player ${playerId} left ${room.roomId}`,
    playerId,
    room,
  });
};

export const handleDisconnect = (playerId: string) => {
  rooms.forEach(({ roomId, clients: players }) => {
    if (players.includes(playerId)) {
      handleLeave(roomId, playerId);
    }
  });
  clients.delete(playerId);
};

export const handleStart = (roomId: string, playerId: string) => {
  const room = startRoom(roomId, playerId);

  broadcastMessage(roomId, {
    type: "started",
    message: `Room ${roomId} started`,
    room,
  });
};

export const handleMove = (
  roomId: string,
  playerId: string,
  boardIndex: number
) => {
  const room = getRoom(roomId);
  const { game } = room;

  if (room.ended) {
    throw new Error("Game has ended");
  }

  if (!room.started || !game) {
    throw new Error("Game not started yet");
  }

  if (game.players[game.turn] !== playerId) {
    throw new Error("Not the player's turn");
  }

  const board = move(game.board, boardIndex, game.turn);
  game.board = board;

  broadcastMessage(roomId, {
    type: "moved",
    playerId,
    boardIndex,
    room,
  });

  const winner = checkWin(board, game.turn);

  if (winner) {
    room.ended = true;
    game.winner = { ...winner, playerId };

    broadcastMessage(roomId, {
      type: "won",
      room,
    });

    return;
  }

  game.turn = game.turn === "X" ? "O" : "X";
};
