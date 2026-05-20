import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evento {
  ID_Evento: number;
  FechaHoraRecepcion: string;
  Estado: string;
  ID_Dispositivo: number;
  SerieDispositivo: string;
  NombreDispositivo: string;
  NombreModelo: string;
  TipoEvento: string;
  DescripcionEvento: string;
  NivelCriticidad: string;
  NombreAbonado: string;
  NumeroDeAbonado: string;
}

export interface CodigoEvento {
  ID_CodigoEvento: number;
  Codigo: string;
  DescripcionAlarma: string;
  Prioridad: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getEventos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/eventos`, { headers: this.getHeaders() });
  }

  updateEstado(id: number, estado: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/eventos/${id}`,
      { Estado: estado },
      { headers: this.getHeaders() }
    );
  }

  crearEvento(data: { ID_Dispositivo: number, ID_CodigoEvento: number }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/eventos`,
      data,
      { headers: this.getHeaders() }
    );
  }

  getDispositivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dispositivos`, { headers: this.getHeaders() });
  }

  getCodigosEvento(): Observable<any> {
    return this.http.get(`${this.apiUrl}/codigos-eventos`, { headers: this.getHeaders() });
  }
}