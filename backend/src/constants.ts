const Horizontal = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];
const Vertical = [
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];
const Diagonal = [
  [0, 4, 8],
  [2, 4, 7],
];

export const WIN_PATTERNS = {
  Horizontal,
  Vertical,
  Diagonal,
};

export const MAX_PLAYERS = 2;

export const CREATE = "create";
export const JOIN = "join";
export const LEAVE = "leave";
export const START = "start";
export const MOVE = "move";
