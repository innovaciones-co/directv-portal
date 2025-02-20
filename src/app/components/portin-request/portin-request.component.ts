import { Component, OnInit } from '@angular/core';
import { GetCustomersBySubscriptionService } from '../../services/get-customers-by-subscription.service'; 
import { GetNetworkOperatorService } from '../../services/get-network-operator-code.service';
import { PutPortInRequestService } from '../../services/put-port-in-request.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-portin-request',
  templateUrl: './portin-request.component.html',
  styleUrls: ['./portin-request.component.scss']
})
export class PortinRequestComponent implements OnInit {
  subscriberId$!: Observable<number | null>; // Mantener el observable sin modificarlo
  operatorCode$!: Observable<string | null>; // Nuevo observable para el código del operador

  minPortDate: string = ''; // Fecha mínima para la portabilidad (día siguiente)

  portRequest = {
    documentType: '',
    documentNumber: '',
    portWindow: '',
    subscriberType: '',
    subscriberName: '',
    subscriberLastName: '',
    subscriberAddress: '',
    subscriberServiceType: '',
    authCode: '' // Nuevo campo para almacenar el NIP
  };

  constructor(
    private getCustomersBySubscriptionService: GetCustomersBySubscriptionService,
    private getNetworkOperatorService: GetNetworkOperatorService,
    private putPortInRequestService: PutPortInRequestService
  ) {}

  ngOnInit(): void {
    this.subscriberId$ = this.getCustomersBySubscriptionService.subscriberId$; // Asignar el observable directamente
    this.operatorCode$ = this.getNetworkOperatorService.operatorCode$; // Suscribirse al observable del operador

    // Calcular el día siguiente como la fecha mínima para la portabilidad
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minPortDate = tomorrow.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  formatDate(event: any) {
    const selectedDate = new Date(event.target.value);
    this.portRequest.portWindow = selectedDate.toISOString();
  }

  onSubmit() {
    if (!this.portRequest.documentType || !this.portRequest.documentNumber || !this.portRequest.authCode) {
      return;
    }
    
    this.subscriberId$.subscribe(subscriberId => {
      this.operatorCode$.subscribe(operatorCode => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const requestData = {
          subscriberId: subscriberId?.toString() || '',
          authCode: this.portRequest.authCode,
          donorOperator: operatorCode || '',
          recipientOperator: "00011",
          requestedFutureDate: this.portRequest.portWindow || tomorrow.toISOString(),
          subscriberType: this.portRequest.subscriberType === 'Natural' ? 'NATURAL' : 'COMPANY',
          transparentData: {
            subscriberName: `${this.portRequest.subscriberName} ${this.portRequest.subscriberLastName}`.trim(),
            subscriberAddress: this.portRequest.subscriberAddress,
            subscriberIdentity: this.portRequest.documentNumber,
            subscriberServiceType: this.portRequest.subscriberServiceType === 'Prepago' ? 'PREPAID' : 'POSTPAID'
          }
        };

        this.putPortInRequestService.sendPortInRequest(requestData).subscribe(
          response => {
            console.log('Solicitud de portabilidad enviada con éxito:', response);
            Swal.fire('Solicitud procesada correctamente', '', 'success');
            console.log('Solicitud de portabilidad enviada con éxito:', response);
          },
          error => {
            Swal.fire('No se pudo procesar su solicitud', 'Por favor intente más tarde.', 'error');
            console.error('Error al enviar la solicitud de portabilidad:', error);
            console.error('Error al enviar la solicitud de portabilidad:', error);
          }
        );
      });
    });
  }
}
