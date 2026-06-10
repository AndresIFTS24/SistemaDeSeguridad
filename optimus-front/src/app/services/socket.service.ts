import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;
  private readonly SERVER_URL = 'http://localhost:3000';
  private audioCtx: AudioContext | null = null;

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

  // =====================================================
  // SONIDOS - Web Audio API
  // =====================================================

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  /**
   * Sonido CRÍTICO — sirena de emergencia larga y urgente
   */
  reproducirAlarmaCritica(): void {
    const ctx = this.getAudioContext();
    const duracionTotal = 3; // 3 segundos de alarma
    const ciclos = 6;        // 6 subidas y bajadas de frecuencia

    for (let i = 0; i < ciclos; i++) {
      const oscillator = ctx.createOscillator();
      const gainNode   = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const inicio = ctx.currentTime + (i * duracionTotal / ciclos);
      const fin    = inicio + (duracionTotal / ciclos);

      oscillator.type = 'sawtooth'; // sonido de sirena — más agresivo

      // Efecto sirena: sube y baja la frecuencia como una ambulancia
      oscillator.frequency.setValueAtTime(440, inicio);
      oscillator.frequency.linearRampToValueAtTime(1200, inicio + (duracionTotal / ciclos / 2));
      oscillator.frequency.linearRampToValueAtTime(440, fin);

      gainNode.gain.setValueAtTime(0.7, inicio);
      gainNode.gain.setValueAtTime(0.7, fin - 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, fin);

      oscillator.start(inicio);
      oscillator.stop(fin);
    }
  }

  /**
   * Sonido NORMAL — suave, corto, una sola nota
   */
  reproducirAlarmaNormal(): void {
    const ctx = this.getAudioContext();

    const oscillator = ctx.createOscillator();
    const gainNode   = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(520, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);
  }
}