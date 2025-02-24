import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PutPortInRequestService {
  private apiBaseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    // La URL base se carga desde la configuración
    this.apiBaseUrl = configService.apiBaseUrl;
  }

  /**
   * Envía la solicitud de portabilidad (portInRequest) al backend.
   * El payload debe tener la siguiente estructura:
   * {
   *   "subscriberId":
   *   "authCode": 
   *   "donorOperator": 
   *   "newMsisdn": 
   *   "recipientOperator": 
   *   "requestedFutureDate": 
   *   "subscriberType": 
   *   "transparentData": {
   *       "subscriberIdentityType": 
   *       "subscriberIdentity":
   *       "subscriberIdentityIssue": 
   *       "nip": "56399",
   *       "subscriberName": 
   *       "subscriberAddress": 
   *       "subscriberServiceType": 
   *   }
   * }
   */
  sendPortInRequest(portInData: any): Observable<any> {
    const url = `${this.apiBaseUrl}/api-dtv/portInRequest`;
    return this.http.put<any>(url, portInData).pipe(
      map(response => {
        // Se asume que response.responseCode es 0 para éxito.
        if (response.responseCode === 0 || response.responseCode === '0') {
          return response;
        } else {
          throw new Error(response.responseDetail || 'Error desconocido en la solicitud de portabilidad');
        }
      }),
      catchError(error => {
        console.error('Error en putPortInRequest:', error);
        return throwError(() => new Error(error.message || 'Error en la solicitud de portabilidad'));
      })
    );
  }
}
