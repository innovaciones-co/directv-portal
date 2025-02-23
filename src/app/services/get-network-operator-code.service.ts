import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GetNetworkOperatorService {
  private operatorCodeSubject = new BehaviorSubject<string | null>(null);
  operatorCode$ = this.operatorCodeSubject.asObservable();

  public apiBaseUrl!: string;
  

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiBaseUrl=configService.apiBaseUrl;
    
  }

  getOperator(phoneNumber: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api-dtv/getNetworkOperator?phoneNumber=${phoneNumber}`;
    const headers = new HttpHeaders({
      'accept': 'application/json'
    });

    return this.http.get<any>(url, { headers }).pipe(
      tap(response => {
        if (response?.payload?.operatorCode) {
          const operatorCode = response.payload.operatorCode;
          this.operatorCodeSubject.next(operatorCode); // Guardar en el Observable
          console.log(`Operator Code: ${operatorCode}`);
        } else {
          console.warn('No se encontró operatorCode en la respuesta.');
        }
      })
    );
  }
}
