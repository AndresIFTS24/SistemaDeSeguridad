import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // AGREGAMOS ESTO PARA TRAER LOS USUARIOS AL DASHBOARD
  getUsers(): Observable<any> {
    // Apuntamos a /users que es donde el UserController.getAll responde
    return this.http.get(`${this.apiUrl}/users`);
  }
}