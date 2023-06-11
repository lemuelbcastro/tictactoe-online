import { Room } from "../types";

type LobbyProps = {
  playerId: string;
  room: Room;
  handleStart: () => void;
};

const Lobby = ({ playerId, room, handleStart }: LobbyProps) => {
  const { roomId, clients, host, ready } = room;
  const isHost = playerId === host;

  return (
    <div className="lobby">
      <div className="lobby__room-id">Room ID: {roomId}</div>
      <div className="lobby__clients">
        <div className="lobby__clients__title">Clients</div>
        {clients.map((client) => (
          <p key={client}>{client}</p>
        ))}
      </div>
      {isHost && (
        <button onClick={handleStart} disabled={!ready}>
          Start
        </button>
      )}
    </div>
  );
};

export default Lobby;
