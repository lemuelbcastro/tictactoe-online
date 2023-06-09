export type Message = {
  type: string;
  payload: Payload;
};

export type Payload = { roomId: string; boardIndex?: number };

export type Room = {
  roomId: string;
  host: string;
  clients: string[];
  ready: boolean;
  started: boolean;
  ended: boolean;
  game?: Game;
};

export type Turn = "X" | "O";
export type Board = Array<Turn | null>;
export type Winner = {
  patternName: string;
  pattern: number[];
  playerId: string;
};

export type Game = {
  board: Board;
  turn: Turn;
  players: { [key in Turn]: string };
  winner?: Winner;
};
