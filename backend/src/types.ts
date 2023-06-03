export type Payload = {
  type: string;
  params: {
    roomId: string;
    boardIndex: number;
  };
};

export type Room = {
  roomId: string;
  host: string;
  clients: string[];
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
