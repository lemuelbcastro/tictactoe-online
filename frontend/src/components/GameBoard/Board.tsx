import { Board as BoardType } from "../../types";

type BoardProps = {
  board: BoardType;
  handleMove: (boardIndex: number) => void;
};

const Board = ({ board, handleMove }: BoardProps) => (
  <div className="board">
    {board.map((tile, index) => (
      <div key={index} className="board__tile" onClick={() => handleMove(index)}>
        {tile}
      </div>
    ))}
  </div>
);

export default Board;
