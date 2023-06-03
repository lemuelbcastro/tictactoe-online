export type Payload = {
  type: string;
  params: {
    roomId: string;
  };
};

export type Room = {
  roomId: string;
  host: string;
  players: string[];
  started: boolean;
  ended: boolean;
  game?: Game;
};

export type Game = {
  board: Array<string | null>;
  turn: "X" | "O";
  winner?: string;
};
