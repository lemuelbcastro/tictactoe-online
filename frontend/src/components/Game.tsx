import { useState } from "react";

import useGameState, { useGameStateDispatch } from "../hooks/useGameState";
import useWebsocket from "../hooks/useWebSocket";
import { Message } from "../types";
import GameBoard from "./GameBoard";
import Lobby from "./Lobby";
import Menu from "./Menu";

function Game() {
  const [roomId, setRoomId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [connected, setConnected] = useState(false);

  const onPlayerIdChange = (playerId: string) => {
    setPlayerId(playerId);
  };

  const onRoomIdChange = (roomId: string) => {
    setRoomId(roomId);
  };

  const onOpen = () => {
    setConnected(true);
  };

  const onClose = () => {
    setConnected(false);
  };

  const onMessage = (event: WebSocketEventMap["message"]) => {
    const message: Message = JSON.parse(event.data);

    dispatch(message);
  };

  const { connect, sendMessage } = useWebsocket({ onOpen, onClose, onMessage });
  const { room, screen } = useGameState();
  const dispatch = useGameStateDispatch();

  const handleConnect = () => {
    connect(`ws://172.26.192.196:3000?playerId=${playerId}`);
  };

  const handleCreate = () => {
    sendMessage(JSON.stringify({ type: "create" }));
  };

  const handleJoin = () => {
    sendMessage(JSON.stringify({ type: "join", payload: { roomId } }));
  };

  const handleStart = () => {
    sendMessage(
      JSON.stringify({ type: "start", payload: { roomId: room?.roomId } })
    );
  };

  const handleMove = (boardIndex: number) => {
    sendMessage(
      JSON.stringify({
        type: "move",
        payload: { roomId: room?.roomId, boardIndex },
      })
    );
  };

  const handleRestart = () => {
    sendMessage(
      JSON.stringify({ type: "restart", payload: { roomId: room?.roomId } })
    );
  };

  switch (screen) {
    case "menu":
      return (
        <Menu
          connected={connected}
          roomId={roomId}
          playerId={playerId}
          handleConnect={handleConnect}
          handleCreate={handleCreate}
          handleJoin={handleJoin}
          onPlayerIdChange={onPlayerIdChange}
          onRoomIdChange={onRoomIdChange}
        />
      );
    case "room":
      return (
        <Lobby room={room} handleStart={handleStart} playerId={playerId} />
      );
    case "game":
      return (
        <GameBoard
          room={room}
          playerId={playerId}
          handleMove={handleMove}
          handleRestart={handleRestart}
        />
      );
  }
}

export default Game;
