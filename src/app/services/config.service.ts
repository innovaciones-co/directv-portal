import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import config from '../../assets/config.json';


@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any;

  constructor() {
    this.config = config;
  }
  // Métodos para obtener la configuración
  get apiBaseUrl(){
    return this.config.apiBaseUrl;   
  }
  get usertJWT(){
    return this.config.userJWT;
  }
  get passwordtJWT(){
    return this.config.passwordJWT;
  }

}

