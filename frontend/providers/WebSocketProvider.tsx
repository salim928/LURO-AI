'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WebSocketContextType {
  socket: WebSocket | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  sendMessage: (message: any) => void;
  lastMessage: MessageEvent | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connectionStatus: 'disconnected',
  sendMessage: () => {},
  lastMessage: null
});

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
  userId: string;
}

export function WebSocketProvider({ children, userId }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<WebSocketContextType['connectionStatus']>('disconnected');
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}/ws/dashboard/${userId}`;
    const ws = new WebSocket(wsUrl);

    setConnectionStatus('connecting');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      setLastMessage(event);
      
      // Handle different message types
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'analysis_progress':
            // Progress updates are handled by components that need them
            break;
            
          case 'analysis_complete':
            toast({
              title: 'Analysis Complete',
              description: `Your analysis "${data.analysis?.title}" has finished processing.`,
              variant: 'default'
            });
            break;
            
          case 'analysis_failed':
            toast({
              title: 'Analysis Failed',
              description: data.error || 'Your analysis encountered an error.',
              variant: 'destructive'
            });
            break;
            
          case 'data_source_connected':
            toast({
              title: 'Data Source Connected',
              description: `Successfully connected to ${data.sourceName}`,
              variant: 'default'
            });
            break;
            
          case 'system_notification':
            toast({
              title: data.title || 'System Notification',
              description: data.message,
              variant: data.variant || 'default'
            });
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      setConnectionStatus('disconnected');
      setSocket(null);
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (ws.readyState === WebSocket.CLOSED) {
          console.log('Attempting to reconnect...');
          // This will trigger the useEffect to run again
        }
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [userId, toast]);

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Cannot send message:', message);
    }
  };

  const value: WebSocketContextType = {
    socket,
    connectionStatus,
    sendMessage,
    lastMessage
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}