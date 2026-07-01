// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardKpis {
  totalAbonados: number;
  eventosHoy: number;
  ticketsAbiertos: number;
  tecnicosActivos: number;
  asignacionesHoy: number;
}

export interface ResumenDireccion {
  abonados: { activos: number; variacionPorcentual: number | null; periodoComparacion: string };
  ingresosMensualesEstimados: {
    montoActual: number;
    moneda: string;
    variacionPorcentual: number | null;
    periodoComparacion: string;
    nota: string;
  };
  tecnicos: { total: number; activosEmpleo: number; inactivosEmpleo: number; enCampoAhora: number };
  alarmasCriticas: { cantidad: number; criterioPrioridad: string[] };
  otCompletadas: { cantidad: number; total: number; porcentaje: number };
}

export interface EvolucionAbonadosPunto {
  periodo: string;
  nuevos: number;
  acumulado: number;
}

export interface EvolucionAbonadosResponse {
  meses: number;
  serie: EvolucionAbonadosPunto[];
}

export interface VolumenEventosPunto {
  hora: string;
  cantidad: number;
}

export interface VolumenEventosResponse {
  serie: VolumenEventosPunto[];
}

export interface EventoReciente {
  idEvento: number;
  codigo: string;
  descripcionAlarma: string;
  prioridad: string;
  estadoEvento: string;
  estadoUI: 'critico' | 'atencion' | 'resuelto';
  fechaHoraRecepcion: string;
  abonado: string;
}

export interface EventosRecientesResponse {
  eventos: EventoReciente[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getKpis(): Observable<DashboardKpis> {
    return this.http.get<DashboardKpis>(`${this.apiUrl}/kpis`, { headers: this.authHeaders() });
  }

  getResumenDireccion(): Observable<ResumenDireccion> {
    return this.http.get<ResumenDireccion>(`${this.apiUrl}/direccion/resumen`, { headers: this.authHeaders() });
  }

  getEvolucionAbonados(meses: 3 | 6 | 12 = 6): Observable<EvolucionAbonadosResponse> {
    return this.http.get<EvolucionAbonadosResponse>(
      `${this.apiUrl}/direccion/evolucion-abonados?meses=${meses}`,
      { headers: this.authHeaders() }
    );
  }

  getVolumenEventos(): Observable<VolumenEventosResponse> {
    return this.http.get<VolumenEventosResponse>(`${this.apiUrl}/direccion/volumen-eventos`, { headers: this.authHeaders() });
  }

  getEventosRecientes(limit: number = 6): Observable<EventosRecientesResponse> {
    return this.http.get<EventosRecientesResponse>(
      `${this.apiUrl}/direccion/eventos-recientes?limit=${limit}`,
      { headers: this.authHeaders() }
    );
  }
}