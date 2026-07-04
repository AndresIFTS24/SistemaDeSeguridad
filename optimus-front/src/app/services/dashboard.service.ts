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

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) {}

  getKpis(): Observable<DashboardKpis> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<DashboardKpis>(`${this.apiUrl}/kpis`, { headers });
  }

  // 🎯 NUEVO: Agregamos el método que le faltaba a TypeScript para consultar la BD
  getPresupuestosComerciales(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // Apuntamos a la ruta de presupuestos/cotizaciones en tu backend
    return this.http.get<any[]>(`${this.apiUrl}/presupuestos`, { headers });
  }
}