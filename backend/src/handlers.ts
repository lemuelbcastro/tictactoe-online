import { WebSocket } from "ws";

import {
  createRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  reconnectRoom,
  restartRoom,
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
    payload: {
      room,
    },
  });
};

export const handleJoin = (roomId: string, playerId: string) => {
  const room = joinRoom(roomId, playerId);

  broadcastMessage(roomId, {
    type: "joined",
    message: `Player ${playerId} joined ${room.roomId}`,
    payload: {
      playerId,
      room,
    },
  });
};

export const handleLeave = (roomId: string, playerId: string) => {
  const room = leaveRoom(roomId, playerId);

  broadcastMessage(roomId, {
    type: "left",
    message: `Player ${playerId} left ${room.roomId}`,
    payload: {
      playerId,
      room,
    },
  });
};

export const handleDisconnect = (playerId: string) => {
  for (const [roomId, { clients }] of rooms) {
    if (clients.includes(playerId)) {
      const room = leaveRoom(roomId, playerId);

      broadcastMessage(roomId, {
        type: "disconnected",
        message: `Player ${playerId} disconnected from ${room.roomId}`,
        payload: {
          playerId,
          room,
        },
      });

      return;
    }
  }
};

export const handleReconnect = (roomId: string, playerId: string) => {
  const room = reconnectRoom(roomId, playerId);

  broadcastMessage(roomId, {
    type: "reconnected",
    message: `Player ${playerId} reconnected to ${room.roomId}`,
    payload: {
      playerId,
      room,
    },
  });
};

export const handleStart = (roomId: string, playerId: string) => {
  const room = startRoom(roomId, playerId);

  broadcastMessage(roomId, {
    type: "started",
    message: `Room ${roomId} started`,
    payload: {
      room,
    },
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
    message: `${playerId} made a move in ${roomId}`,
    payload: {
      boardIndex,
      playerId,
      room,
    },
  });

  const winner = checkWin(board, game.turn);

  if (winner) {
    room.ended = true;
    game.winner = { ...winner, playerId };

    broadcastMessage(roomId, {
      type: "won",
      message: `${playerId} won in ${roomId}`,
      payload: {
        room,
      },
    });

    return;
  }

  game.turn = game.turn === "X" ? "O" : "X";
};

export const handleRestart = (roomId: string, playerId: string) => {
  const room = restartRoom(roomId, playerId);

  broadcastMessage(roomId, {
    type: "restarted",
    message: `Room ${roomId} restarted`,
    payload: {
      room,
    },
  });
};
