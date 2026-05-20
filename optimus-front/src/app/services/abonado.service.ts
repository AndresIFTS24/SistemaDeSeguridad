import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbonadoService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAllAbonados(): Observable<any> {
    return this.http.get(`${this.apiUrl}/abonados`, { headers: this.getHeaders() });
  }

  getAbonadoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/abonados/${id}`, { headers: this.getHeaders() });
  }

  createAbonado(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/abonados`, data, { headers: this.getHeaders() });
  }

  updateAbonado(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/abonados/${id}`, data, { headers: this.getHeaders() });
  }

  desactivarAbonado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/abonados/${id}`, { headers: this.getHeaders() });
  }
}