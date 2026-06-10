import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;
  private readonly SERVER_URL = 'http://localhost:3000';

  constructor() {
    this.socket = io(this.SERVER_URL, {
      transports: ['websocket'],
      autoConnect: false
    });

    this.socket.on('connect', () =>
      console.log('🔌 WebSocket conectado al servidor OPTIMUS:', this.socket.id)
    );
    this.socket.on('disconnect', (reason) =>
      console.log('🔌 WebSocket desconectado:', reason)
    );
    this.socket.on('connect_error', (err) =>
      console.error('❌ Error de conexión WebSocket:', err.message)
    );
  }

  connect(): void {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  on<T>(evento: string): Observable<T> {
    return new Observable(observer => {
      this.socket.on(evento, (data: T) => observer.next(data));
      return () => this.socket.off(evento);
    });
  }

  emit(evento: string, data?: any): void {
    this.socket.emit(evento, data);
  }

  get conectado(): boolean {
    return this.socket.connected;
  }
}