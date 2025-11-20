import { wsClient } from '@/services/websocket/wsClient';
import { localStorageService } from '@/services/storage/localStorage';
import { toast } from '@/stores/useNotificationStore';

class WebSocketManager {
  private static instance: WebSocketManager;
  private connected = false;

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  async connect(): Promise<void> {
    if (this.connected) return;

    try {
      const token = localStorageService.getToken();
      await wsClient.connect(token || undefined);
      this.connected = true;
      console.log('WebSocket connected');
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      toast.error('Connection Error', 'Failed to establish real-time connection');
    }
  }

  disconnect(): void {
    wsClient.disconnect();
    this.connected = false;
    console.log('WebSocket disconnected');
  }

  subscribe<T = any>(event: string, handler: (data: T) => void): () => void {
    return wsClient.subscribe(event, handler);
  }

  send(event: string, data: any): void {
    wsClient.send(event, data);
  }

  isConnected(): boolean {
    return this.connected && wsClient.isConnected();
  }
}

export const ws = WebSocketManager.getInstance();
export default ws;