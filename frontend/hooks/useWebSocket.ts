// 1. CREATE: frontend/hooks/useWebSocket.ts
import { useState, useEffect, useRef } from 'react';

interface UseWebSocketReturn {
  connectionStatus: 'Connecting' | 'Connected' | 'Disconnected' | 'Error';
  lastMessage: MessageEvent | null;
  sendMessage: (message: string) => void;
  disconnect: () => void;
}

export function useWebSocket(url: string, enabled: boolean = true): UseWebSocketReturn {
  const [connectionStatus, setConnectionStatus] = useState<'Connecting' | 'Connected' | 'Disconnected' | 'Error'>('Disconnected');
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const sendMessage = (message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    }
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

  useEffect(() => {
    if (!enabled || !url) {
      setConnectionStatus('Disconnected');
      return;
    }

    setConnectionStatus('Connecting');

    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setConnectionStatus('Connected');
      };

      ws.current.onmessage = (event) => {
        setLastMessage(event);
      };

      ws.current.onclose = () => {
        setConnectionStatus('Disconnected');
      };

      ws.current.onerror = () => {
        setConnectionStatus('Error');
      };
    } catch (error) {
      setConnectionStatus('Error');
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, enabled]);

  return {
    connectionStatus,
    lastMessage,
    sendMessage,
    disconnect,
  };
}