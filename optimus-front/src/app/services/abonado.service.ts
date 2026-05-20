import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importa HttpHeaders
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbonadoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getAllAbonados(): Observable<any> {
    // 1. Buscamos el token que guardamos al hacer login
    const token = localStorage.getItem('token'); 

    // 2. Creamos la cabecera con el formato "Bearer TOKEN"
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 3. Enviamos la petición incluyendo las cabeceras
    return this.http.get(`${this.apiUrl}/abonados`, { headers });
  }
}