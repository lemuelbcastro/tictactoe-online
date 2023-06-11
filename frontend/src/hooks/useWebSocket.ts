import { useRef } from "react";

type UseWebSocketType = {
  onOpen?: (event: WebSocketEventMap["open"]) => void;
  onClose?: (event: WebSocketEventMap["close"]) => void;
  onMessage?: (event: WebSocketEventMap["message"]) => void;
  onError?: (event: WebSocketEventMap["error"]) => void;
};

type WebSocketMessage = Parameters<WebSocket["send"]>[0];

const useWebsocket = ({
  onOpen,
  onClose,
  onMessage,
  onError,
}: UseWebSocketType) => {
  const ws = useRef<WebSocket>();

  const connect = (url: string) => {
    ws.current = new WebSocket(url);

    onOpen && ws.current.addEventListener("open", onOpen);
    onClose && ws.current.addEventListener("close", onClose);
    onMessage && ws.current.addEventListener("message", onMessage);
    onError && ws.current.addEventListener("error", onError);
  };

  const sendMessage = (data: WebSocketMessage) => {
    ws.current?.send(data);
  };

  return { connect, sendMessage };
};

export default useWebsocket;
