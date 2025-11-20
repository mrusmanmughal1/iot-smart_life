import { useEffect, useRef, useCallback } from 'react';
import { ws } from '@/lib/websocket';

export function useWebSocket<T = any>(
  event: string,
  handler: (data: T) => void,
  deps: any[] = []
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const unsubscribe = ws.subscribe<T>(event, (data) => {
      savedHandler.current(data);
    });

    return () => {
      unsubscribe();
    };
  }, [event, ...deps]);

  const send = useCallback((data: any) => {
    ws.send(event, data);
  }, [event]);

  return { send, isConnected: ws.isConnected() };
}