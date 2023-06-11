import { Room } from "../../types";
import Board from "./Board";
import GameInfo from "./BoardInfo";

type GameBoardProps = {
  room: Room;
  playerId: string;
  handleMove: (boardIndex: number) => void;
  handleRestart: () => void;
};

const GameBoard = ({
  room,
  playerId,
  handleMove,
  handleRestart,
}: GameBoardProps) => (
  <>
    <Board board={room.game?.board!} handleMove={handleMove} />
    <GameInfo room={room} playerId={playerId} handleRestart={handleRestart} />
  </>
);
export default GameBoard;
