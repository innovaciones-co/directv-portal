import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PutBlockDeviceByImeiService {
  private apiBaseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiBaseUrl = configService.apiBaseUrl;
  }

  blockDeviceByImei(data: any): Observable<any> {
    const url = `${this.apiBaseUrl}/api-dtv/blockDeviceByImei`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<any>(url, data, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error en blockDeviceByImei:', error);
        return throwError(() => new Error(error.message || 'Error al bloquear el dispositivo por IMEI'));
      })
    );
  }
}
