import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_WS_BASE_URL || 'wss://api.smart-life.sa';

class WebSocketClient {
  private socket: Socket | null = null;
  private connected = false;

  async connect(token?: string): Promise<void> {
    if (this.connected) return;

    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          auth: {
            token,
          },
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 3000,
        });

        this.socket.on('connect', () => {
          this.connected = true;
          console.log('✅ WebSocket connected! Socket ID:', this.socket?.id);
          resolve();
        });

        this.socket.on('connect_error', (err) => {
          console.error('❌ WebSocket connection error:', err.message);
          reject(err);
        });

        this.socket.on('disconnect', (reason) => {
          this.connected = false;
          console.log('🔒 WebSocket disconnected. Reason:', reason);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connected = false;
  }

  subscribe<T = unknown>(
    event: string,
    handler: (data: T) => void
  ): () => void {
    if (!this.socket) {
      throw new Error('WebSocket is not connected. Call connect() first.');
    }
    this.socket.on(event, handler);
    return () => {
      this.socket?.off(event, handler);
    };
  }

  send(event: string, data: unknown): void {
    if (!this.socket) {
      throw new Error('WebSocket is not connected. Call connect() first.');
    }
    this.socket.emit(event, data);
  }

  isConnected(): boolean {
    return this.connected;
  }
}

const wsClient = new WebSocketClient();
export default wsClient;
