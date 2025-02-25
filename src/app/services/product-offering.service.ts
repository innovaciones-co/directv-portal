import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductOfferingService {
  private configUrl = 'assets/config/productoffering.json';

  constructor(private http: HttpClient) {}

  getProductOffering(): Observable<any> {
    return this.http.get<any>(this.configUrl);
  }
}