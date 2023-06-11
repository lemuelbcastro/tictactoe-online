type GameMenuProps = {
  connected: boolean;
  roomId: string;
  playerId: string;
  handleConnect: () => void;
  handleCreate: () => void;
  handleJoin: () => void;
  onPlayerIdChange: (playerId: string) => void;
  onRoomIdChange: (roomId: string) => void;
};

const GameMenu = ({
  connected,
  roomId,
  playerId,
  handleConnect,
  handleCreate,
  handleJoin,
  onPlayerIdChange,
  onRoomIdChange,
}: GameMenuProps) => (
  <div className="menu">
    {connected ? (
      <>
        <button onClick={handleCreate} disabled={!playerId}>
          Create Game
        </button>
        <div className="menu__join">
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(event) => onRoomIdChange(event.target.value)}
          />
          <button onClick={handleJoin} disabled={!roomId || !playerId}>
            Join Game
          </button>
        </div>
      </>
    ) : (
      <>
        <input
          type="text"
          placeholder="Player name"
          value={playerId}
          onChange={(event) => onPlayerIdChange(event.target.value)}
        />
        <button onClick={handleConnect} disabled={!playerId}>
          Connect
        </button>
      </>
    )}
  </div>
);

export default GameMenu;
