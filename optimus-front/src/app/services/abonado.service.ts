import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbonadoService {
  private apiUrl = 'https://app-c923eddd-1b84-41d8-bc9f-0985196bd087.cleverapps.io/api'; // Ajusta tu URL

  constructor(private http: HttpClient) { }

  getAllAbonados(): Observable<any> {
    return this.http.get(`${this.apiUrl}/abonados`);
  }
}
