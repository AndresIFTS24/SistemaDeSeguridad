// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  alarmasCriticas: { cantidad: number; pendientes: number; enProgreso: number; criterioPrioridad: string[] };
  otCompletadas: { cantidad: number; total: number; porcentaje: number };
}

export interface ResumenTecnicos {
  total: number;
  activosEmpleo: number;
  inactivosEmpleo: number;
  enCampoAhora: number;
  disponibles: number;
}

// "Alarmas Críticas" de Monitoreo — mismo criterio que ResumenDireccion.alarmasCriticas.
export interface ResumenMonitoreo {
  alarmasCriticas: { cantidad: number; pendientes: number; enProgreso: number };
}

// Ubicación real de la asignación 'En Curso' de un técnico. Tres formas
// posibles, sin ninguna que invente una coordenada:
//  - { enCurso: false } — no tiene asignación en curso ahora mismo.
//  - { enCurso: true, geocodificado: false, direccion } — dirección real
//    pero todavía sin CoordenadasGPS.
//  - { enCurso: true, geocodificado: true, coordenadasGPS, direccion }
export interface UbicacionActualTecnico {
  enCurso: boolean;
  geocodificado?: boolean;
  coordenadasGPS?: string;
  direccion?: { Calle: string; Numero: string; Ciudad: string };
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

export interface AuditoriaEventosFiltros {
  page?: number;
  limit?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  idAbonado?: number;
  prioridad?: string[];
  estado?: string[];
}

export interface EventoAuditoria {
  idEvento: number;
  fechaHoraRecepcion: string;
  codigo: string;
  descripcionAlarma: string;
  prioridad: string;
  estado: string;
  abonado: { id: number; razonSocial: string; numeroDeAbonado: string };
  direccion: { calle: string; ciudad: string };
  dispositivo: { nombre: string; zona: string | null };
  atendidoPor: { nombreOperador: string; accionRealizada: string; fechaHoraAccion: string } | null;
}

export interface AuditoriaEventosResponse {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
  eventos: EventoAuditoria[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `${environment.apiUrl}/api/dashboard`;

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

  getResumenTecnicos(): Observable<ResumenTecnicos> {
    return this.http.get<ResumenTecnicos>(`${this.apiUrl}/tecnicos/resumen`, { headers: this.authHeaders() });
  }

  getResumenMonitoreo(): Observable<ResumenMonitoreo> {
    return this.http.get<ResumenMonitoreo>(`${this.apiUrl}/monitoreo/resumen`, { headers: this.authHeaders() });
  }

  getUbicacionActualTecnico(idTecnico: number): Observable<UbicacionActualTecnico> {
    return this.http.get<UbicacionActualTecnico>(
      `${this.apiUrl}/tecnicos/${idTecnico}/ubicacion-actual`,
      { headers: this.authHeaders() }
    );
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

  getAuditoriaEventos(filtros: AuditoriaEventosFiltros): Observable<AuditoriaEventosResponse> {
    const params = new URLSearchParams();
    params.set('page', String(filtros.page ?? 1));
    params.set('limit', String(filtros.limit ?? 25));
    if (filtros.fechaDesde) params.set('fechaDesde', filtros.fechaDesde);
    if (filtros.fechaHasta) params.set('fechaHasta', filtros.fechaHasta);
    if (filtros.idAbonado) params.set('idAbonado', String(filtros.idAbonado));
    if (filtros.prioridad?.length) params.set('prioridad', filtros.prioridad.join(','));
    if (filtros.estado?.length) params.set('estado', filtros.estado.join(','));

    return this.http.get<AuditoriaEventosResponse>(
      `${this.apiUrl}/direccion/auditoria/eventos?${params.toString()}`,
      { headers: this.authHeaders() }
    );
  }
}