import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class CreateTroubleTicketService {
  public apiBaseUrl!: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    // La URL base se carga desde la configuración
    this.apiBaseUrl = configService.apiBaseUrl;
  }

  // Método para crear un Trouble Ticket
  createTroubleTicket(ticketData: any): Observable<any> {
    const url = `${this.apiBaseUrl}/api-dtv/createTroubleTicket`;
    return this.http.post<any>(url, ticketData).pipe(
      tap(response => {
        console.log('Create Trouble Ticket Response:', response);
      }),
      catchError(error => {
        console.error('Error en createTroubleTicket:', error);
        let errorMessage = 'Error llamando al servicio SOAP';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
