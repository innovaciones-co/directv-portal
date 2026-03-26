import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any;

  constructor() {
    this.config = environment;
  }
  // Métodos para obtener la configuración
  get apiBaseUrl() {
    return this.config.apiBaseUrl;
  }
  get userJWT() {
    return this.config.userJWT;
  }

  get passwordJWT() {
    return this.config.passwordJWT;
  }

}

