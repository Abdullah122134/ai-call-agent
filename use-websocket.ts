import { useState, useEffect, useRef, useCallback } from "react";

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  lastMessage: WebSocketMessage | null;
  error: string | null;
}

export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      socketRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      socketRef.current.onclose = () => {
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(connect, 3000);
      };

      socketRef.current.onerror = (err) => {
        setError("WebSocket connection error");
        setIsConnected(false);
      };
    } catch (err) {
      setError("Failed to create WebSocket connection");
    }
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      socketRef.current?.close();
    };
  }, [connect]);

  return {
    isConnected,
    sendMessage,
    lastMessage,
    error
  };
}
