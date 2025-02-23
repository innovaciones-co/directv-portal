import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class GetTroubleTicketCategoriesService {
  public apiBaseUrl!: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    // La URL base se carga desde la configuración
    this.apiBaseUrl = configService.apiBaseUrl;
  }

  // Método para obtener las categorías de Trouble Ticket
  getTroubleTicketCategories(): Observable<any> {
    const url = `${this.apiBaseUrl}/api-dtv/getTroubleTicketCategories`;
    return this.http.get<any>(url).pipe(
      tap(response => {
        console.log('Trouble Ticket Categories:', response);
      })
    );
  }
}
