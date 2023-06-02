export type Payload = {
  type: string;
  params: {
    roomId: string;
  };
};

export type Room = {
  roomId: string;
  players: string[];
};
