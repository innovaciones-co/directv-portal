import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PutBlockSimByNumberService {
  private apiBaseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiBaseUrl = configService.apiBaseUrl;
  }

  blockSimByPhoneNumber(data: { phoneNumber: string }): Observable<any> {
    const url = `${this.apiBaseUrl}/api-dtv/blockSimByPhoneNumber`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<any>(url, data, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error en blockSimByPhoneNumber:', error);
        return throwError(() => new Error(error.message || 'Error al bloquear la SIM por número de teléfono'));
      })
    );
  }
}
