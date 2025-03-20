import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiBaseUrl!: string;
  public userJWT!: string;
  public passwordJWT!: string;
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private configService: ConfigService) {
    // La URL base se carga desde la configuración
    this.apiBaseUrl = configService.apiBaseUrl;
    this.userJWT = configService.usertJWT;
    this.passwordJWT = configService.passwordtJWT;


    
  }

  // Se construye la URL de generación de token dinámicamente
  private getTokenUrl(): string {
    return `${this.apiBaseUrl}/api-dtv/generateToken`;
  }

  // Método para obtener el token al iniciar la app
  initializeToken(): void {
    const url = this.getTokenUrl();
    this.http.post<{ token: string }>(url, {
      username: "lovDirectv",
      password: "asdnbOasdASUDASND0213SD65S"
    }).pipe(
      map(response => response.token),
      tap(token => {
        this.tokenSubject.next(token);
      })
    ).subscribe();
  }

  // Método para obtener el token y almacenarlo en memoria
  getToken(): Observable<string> {
    const url = this.getTokenUrl();
    return this.http.post<{ token: string }>(url, {
      username: "lovDirectv",
      password: "asdnbOasdASUDASND0213SD65S"
    }).pipe(
      map(response => response.token), // Extraer solo el token
      tap(token => this.tokenSubject.next(token)) // Guardar el token en la memoria
    );
  }


  // Obtener el token almacenado
  getStoredToken(): string | null {
    return this.tokenSubject.value;
  }
}
