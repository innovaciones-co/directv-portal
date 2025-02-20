import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class QueryImeiService {
  private apiBaseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiBaseUrl = configService.apiBaseUrl;
  }

queryImei(data: { phoneNumber: string }): Observable<any> {
  const url = `${this.apiBaseUrl}/api/queryImei`;
  return this.http.post<any>(url, data).pipe(
    map(response => response),
    catchError(error => {
      console.error('Error en queryImei:', error);
      return throwError(() => new Error(error.message || 'Error en la consulta de IMEI'));
    })
  );
}
}
