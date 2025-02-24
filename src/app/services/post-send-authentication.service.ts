import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PostSendAuthenticationService {
  public apiBaseUrl!: string;
  public accessKey!: string;

  // BehaviorSubject para almacenar y exponer el número de teléfono a portar
  private phoneNumberToPortSubject = new BehaviorSubject<string>('');
  // Observable público al que se pueden suscribir otros componentes
  phoneNumberToPort$ = this.phoneNumberToPortSubject.asObservable();

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiBaseUrl = configService.apiBaseUrl;
  }

  /**
   * Envía la solicitud de autenticación y actualiza el observable phoneNumberToPort$.
   * @param subscriberId Número del suscriptor.
   * @param phoneNumber El número telefónico a portar.
   * @param operatorCode Código del operador.
   * @returns Observable con la respuesta del servidor.
   */
  sendAuthentication(subscriberId: number, phoneNumber: string, operatorCode: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api-dtv/postSendAuthentication`;
    const body = {
      phoneNumber: phoneNumber,
      subscriberId: subscriberId,    
      operatorCode: operatorCode      
    };

    // Actualiza el BehaviorSubject con el número telefónico
    this.phoneNumberToPortSubject.next(phoneNumber);

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
