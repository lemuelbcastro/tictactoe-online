import { Board, Turn } from "./types";
import { WIN_PATTERNS } from "./constants";

export const move = (board: Board, index: number, turn: Turn) => {
  if (board[index]) {
    throw Error("Invalid move");
  }

  const newBoard = [...board];
  newBoard[index] = turn;

  return newBoard;
};

export const checkWin = (board: Board, turn: Turn) => {
  for (const [patternName, patterns] of Object.entries(WIN_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.every((index) => board[index] === turn)) {
        return { patternName, pattern };
      }
    }
  }
};
