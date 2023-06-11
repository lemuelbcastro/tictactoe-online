import { useContext } from "react";
import {
  GameStateContext,
  GameStateDispatchContext,
} from "../contexts/GameContext";

export const useGameState = () => {
  const context = useContext(GameStateContext);

  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }

  return context;
};

export const useGameStateDispatch = () => {
  const context = useContext(GameStateDispatchContext);

  if (!context) {
    throw new Error(
      "useGameStateDispatch must be used within a GameStateProvider"
    );
  }

  return context;
};

export default useGameState;
