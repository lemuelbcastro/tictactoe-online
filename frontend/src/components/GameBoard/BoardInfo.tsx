import { Room } from "../../types";

type BoardInfoProps = {
  room: Room;
  playerId: string;
  handleRestart: () => void;
};

const BoardInfo = ({
  room: { ended, game, host },
  playerId,
  handleRestart,
}: BoardInfoProps) => {
  if (!game) {
    return null;
  }

  const { winner, players, turn } = game;
  const isHost = playerId === host;

  return (
    <div className="board-info">
      {ended ? (
        <>
          {!!winner && <p>Winner: {winner.playerId}</p>}
          {isHost && <button onClick={handleRestart}>Restart Game</button>}
        </>
      ) : (
        <p>
          {players[turn] === playerId ? "Your" : "Opponent's"} turn {turn}
        </p>
      )}
    </div>
  );
};

export default BoardInfo;
