import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class GetCustomersBySubscriptionService {
  // Observable para almacenar el Subscriber ID
  private subscriberIdSubject = new BehaviorSubject<number | null>(null);
  subscriberId$ = this.subscriberIdSubject.asObservable();

  // Observable para almacenar el Document ID
  private documentIdSubject = new BehaviorSubject<string | null>(null);
  documentId$ = this.documentIdSubject.asObservable();

  // Observable para almacenar el Document Type
  private documentTypeSubject = new BehaviorSubject<string | null>(null);
  documentType$ = this.documentTypeSubject.asObservable();

  public apiBaseUrl!: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    // Cargar la configuración desde el archivo JSON
    this.apiBaseUrl = configService.apiBaseUrl;
  }

  // Método para obtener los datos del cliente basado en el número de teléfono
  getCustomerData(phoneNumber: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/getCustomersBySubscription?phoneNumber=${phoneNumber}`;
    return this.http.get<any>(url).pipe(
      tap(response => {
        console.log(response);

        // Obtener el Subscriber ID si existe
        if (response?.payload?.subscriptions?.length > 0) {
          const subscriberId = response.payload.subscriptions[0].id;
          this.subscriberIdSubject.next(subscriberId); // Guardar en el Observable
          console.log(`Subscriber ID: ${subscriberId}`);
        } else {
          console.warn('No se encontró subscriberId en la respuesta.');
        }

        // Obtener el Document ID si existe
        if (response?.payload?.document?.id) {
          const documentId = response.payload.document.id;
          this.documentIdSubject.next(documentId); // Guardar en el Observable
          console.log(`Document ID: ${documentId}`);
        } else {
          console.warn('No se encontró documentId en la respuesta.');
        }

        // Obtener el Document Type si existe
        if (response?.payload?.document?.type) {
          const documentType = response.payload.document.type;
          this.documentTypeSubject.next(documentType); // Guardar en el Observable
          console.log(`Document Type: ${documentType}`);
        } else {
          console.warn('No se encontró documentType en la respuesta.');
        }
      })
    );
  }
}
