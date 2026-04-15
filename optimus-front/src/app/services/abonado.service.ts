import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbonadoService {
  private apiUrl = 'https://tu-api-en-clever-cloud.com/api/abonados'; // Ajusta tu URL

  constructor(private http: HttpClient) { }

  getAllAbonados(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
