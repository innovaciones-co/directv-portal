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
  subscriberId$!: Observable<number | null>; 
  operatorCode$!: Observable<string | null>; 

  minPortDate: string = ''; 

  portRequest = {
    documentType: '',
    documentNumber: '',
    subscriberIdentityIssue: '',
    portWindow: '',
    subscriberType: '',
    subscriberName: '',
    subscriberAddress: '',
    subscriberServiceType: '',
    authCode: '' 
  };

  constructor(
    private getCustomersBySubscriptionService: GetCustomersBySubscriptionService,
    private getNetworkOperatorService: GetNetworkOperatorService,
    private putPortInRequestService: PutPortInRequestService
  ) {}

  ngOnInit(): void {
    this.subscriberId$ = this.getCustomersBySubscriptionService.subscriberId$;
    this.operatorCode$ = this.getNetworkOperatorService.operatorCode$;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minPortDate = tomorrow.toISOString().split('T')[0];
  }

  onSubmit() {
    if (!this.portRequest.documentType || !this.portRequest.documentNumber || !this.portRequest.authCode) {
      return;
    }

    this.subscriberId$.subscribe(subscriberId => {
      this.operatorCode$.subscribe(operatorCode => {
        const requestData = {
          subscriberId: subscriberId?.toString() || '',
          authCode: this.portRequest.authCode,
          donorOperator: operatorCode || '',
          recipientOperator: "00018",
          requestedFutureDate: this.portRequest.portWindow,
          subscriberType: this.portRequest.subscriberType,
          transparentData: {
            subscriberIdentityType: this.portRequest.documentType,
            subscriberIdentity: this.portRequest.documentNumber,
            subscriberIdentityIssue: this.portRequest.subscriberIdentityIssue.replace(/-/g, "/"),
            nip: this.portRequest.authCode,
            subscriberName: this.portRequest.subscriberName,
            subscriberAddress: this.portRequest.subscriberAddress,
            subscriberServiceType: this.portRequest.subscriberServiceType
          }
        };

        this.putPortInRequestService.sendPortInRequest(requestData).subscribe(
          response => {
            console.log('Solicitud de portabilidad enviada con éxito:', response);
            Swal.fire('Solicitud procesada correctamente', '', 'success');
          },
          error => {
            Swal.fire('No se pudo procesar su solicitud', 'Por favor intente más tarde.', 'error');
            console.error('Error al enviar la solicitud de portabilidad:', error);
          }
        );
      });
    });
  }
  onlyNumber(event: KeyboardEvent): void {
    const charCode = event.charCode;
    // Permitir solo dígitos (códigos ASCII 48 a 57)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
