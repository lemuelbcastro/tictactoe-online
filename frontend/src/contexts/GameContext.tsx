import React, { createContext, useReducer } from "react";
import { Message, Room } from "../types";

type GameState = {
  room: Room;
  screen: "menu" | "room" | "game";
};

export const GameStateContext = createContext<GameState | null>(null);
export const GameStateDispatchContext =
  createContext<React.Dispatch<Message> | null>(null);

export const GameStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [gameState, dispatch] = useReducer(gameReducer, {
    screen: "menu",
  } as GameState);

  return (
    <GameStateContext.Provider value={gameState}>
      <GameStateDispatchContext.Provider value={dispatch}>
        {children}
      </GameStateDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};

const gameReducer = (
  state: GameState,
  { type, payload }: Message
): GameState => {
  switch (type) {
    case "created":
      return { screen: "room", room: payload.room };
    case "joined":
      return { screen: "room", room: payload.room };
    case "started":
      return { screen: "game", room: payload.room };
    case "moved":
      return { ...state, room: payload.room };
    case "changed-turn":
      return { ...state, room: payload.room };
    case "won":
      return { ...state, room: payload.room };
    case "restarted":
      return { screen: "game", room: payload.room };
    default:
      return state;
  }
};
