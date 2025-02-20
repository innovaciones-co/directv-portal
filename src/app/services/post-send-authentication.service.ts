import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PostSendAuthenticationService {
  public apiBaseUrl!: string;
  public accessKey!: string;
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiBaseUrl=configService.apiBaseUrl;
   
  }

  sendAuthentication(subscriberId: number, phoneNumber: string, operatorCode: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/postSendAuthentication`;
    const body = {
      phoneNumber: phoneNumber,
      subscriberId:subscriberId,    
      operatorCode: operatorCode
      
    };

    return this.http.post<any>(url, body).pipe(
      map(response => {
        if (response.responseCode === 0) {
          return response;
        } else {
          throw new Error(response.responseDetail || 'Error desconocido en la solicitud de NIP');
        }
      }),
      catchError(error => {
        console.error('Error en postSendAuthentication:', error);
        return throwError(() => new Error(error.message || 'Error en la solicitud de NIP'));
      })
    );
  }
}
