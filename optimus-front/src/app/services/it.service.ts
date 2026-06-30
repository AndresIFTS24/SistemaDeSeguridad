import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItService {

  private apiUrl = 'http://localhost:3000/api/it';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // ===== PESTAÑA 1: USUARIOS =====

  getUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`, { headers: this.getHeaders() });
  }

  crearUsuario(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, data, { headers: this.getHeaders() });
  }

  actualizarUsuario(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, data, { headers: this.getHeaders() });
  }

  toggleUsuario(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}/toggle`, {}, { headers: this.getHeaders() });
  }

  // ===== PESTAÑA 2: ESTADO DEL SISTEMA =====

  getStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/status`, { headers: this.getHeaders() });
  }

  // ===== PESTAÑA 3: AUDITORÍA =====

  getAuditoria(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auditoria`, { headers: this.getHeaders() });
  }

  // ===== PESTAÑA 4: INFRAESTRUCTURA =====

  getInfraestructura(): Observable<any> {
    return this.http.get(`${this.apiUrl}/infraestructura`, { headers: this.getHeaders() });
  }

  // ===== PESTAÑA 5: ROLES Y SECTORES =====

  getRolesSectores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/roles-sectores`, { headers: this.getHeaders() });
  }

  getActividadUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}/actividad`, { headers: this.getHeaders() });
  }
}