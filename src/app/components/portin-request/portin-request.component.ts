import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PutPortInRequestService } from '../../services/put-port-in-request.service';
import { PostSendAuthenticationService } from '../../services/post-send-authentication.service';
import { GetCustomersBySubscriptionService } from '../../services/get-customers-by-subscription.service';
import { GetNetworkOperatorService } from '../../services/get-network-operator-code.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-portin-request',
  templateUrl: './portin-request.component.html',
  styleUrls: ['./portin-request.component.scss']
})
export class PortinRequestComponent implements OnInit {
  // Observables para obtener subscriberId y operatorCode
  subscriberId$!: Observable<number | null>;
  operatorCode$!: Observable<string | null>;

  // Número a portar obtenido del observable phoneNumberToPort$
  phoneNumberToPort: string = '';
  newMsisdn: string = '';

  // Fecha mínima para "Fecha de Solicitud" (día siguiente)
  minPortDate: string = '';

  // Objeto con los datos del formulario (inicializado con transparentData)
  portRequest: any = {
    authCode: '',                  // NIP ingresado por el usuario
    portWindow: '',                // Fecha de Solicitud (sin hora, ingresada por el usuario)
    subscriberType: '',            // NATURAL o COMPANY
    transparentData: {
      subscriberIdentityType: '',  // Tipo de documento (ID, NIT, FOREIGN_ID, PASSPORT)
      subscriberIdentity: '',      // Número de documento
      subscriberIdentityIssue: '', // Fecha de expedición en formato "YYYY/MM/DD"
      subscriberName: '',          // Nombre del subscriptor
      subscriberAddress: ''        // Dirección
    },
    subscriberServiceType: ''      // PREPAID o POSTPAID
  };

  // Valores provenientes de observables o fijos
  subscriberId: string = "";
  operatorCode: string = "";
  donorOperator: string = "";            // Se mapeará desde operatorCode$
  recipientOperator: string = "00018";    // Valor fijo

  constructor(
    private putPortInRequestService: PutPortInRequestService,
    private postSendAuthService: PostSendAuthenticationService,
    private getCustomersBySubscriptionService: GetCustomersBySubscriptionService,
    private getNetworkOperatorService: GetNetworkOperatorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Calcular la fecha mínima para "Fecha de Solicitud": el día siguiente
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate());
    this.minPortDate = tomorrow.toISOString().split('T')[0];

    // Suscribirse al observable para obtener el número a portar
    this.postSendAuthService.phoneNumberToPort$.subscribe(num => {
      this.phoneNumberToPort = num;
      this.newMsisdn = num;
    });

    // Asignar los observables para subscriberId y operatorCode
    this.subscriberId$ = this.getCustomersBySubscriptionService.subscriberId$;
    this.operatorCode$ = this.getNetworkOperatorService.operatorCode$;

    // Suscribirse para obtener subscriberId
    this.subscriberId$.subscribe(id => {
      if (id !== null) {
        this.subscriberId = id.toString();
      }
    });

    // Suscribirse para obtener operatorCode y asignarlo a donorOperator
    this.operatorCode$.subscribe(code => {
      if (code !== null) {
        this.operatorCode = code;
        this.donorOperator = code;
      }
    });
  }

  // Método para validar que la fecha de expedición tenga formato "YYYY/MM/DD"
  isIdentityIssueValid(value: string): boolean {
    const regex = /^(19|20)\d\d\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])$/;
    return regex.test(value);
  }

  onSubmit(): void {

  // Validar que la fecha de solicitud sea posterior al día actual
  if (this.portRequest.portWindow < this.minPortDate) {
    Swal.fire({
      icon: 'error',
      title: 'Fecha inválida',
      text: 'La fecha solicitud de portabilidad no puede ser menor al día actual.',
      confirmButtonText: 'OK'
    }).then(() => {
      // Reiniciar el campo de fecha de solicitud
      this.portRequest.portWindow = '';
    });
    return;
  }
    
    // Mapear el NIP al campo transparentData.nip (igual que authCode)
    this.portRequest.transparentData.nip = this.portRequest.authCode;

    // Convertir la fecha de solicitud ingresada (portWindow) para incluir la hora actual.
    // Se asume que el usuario selecciona solo la fecha (e.g., "2025-02-25").
    const selectedDate = new Date(this.portRequest.portWindow);
    const now = new Date();
    selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    const formattedPortWindow = selectedDate.toISOString(); // Formato: "YYYY-MM-DDTHH:mm:ss.SSSZ"

    // Construir el objeto de solicitud
    const requestData = {
      subscriberId: this.subscriberId,
      authCode: this.portRequest.authCode,
      donorOperator: this.donorOperator,
      newMsisdn: this.newMsisdn,
      recipientOperator: this.recipientOperator, // Valor fijo "00018"
      requestedFutureDate: formattedPortWindow,
      subscriberType: this.portRequest.subscriberType,
      transparentData: {
        subscriberIdentityType: this.portRequest.transparentData.subscriberIdentityType,
        subscriberIdentity: this.portRequest.transparentData.subscriberIdentity,
        // Convertir fecha de expedición: reemplaza "-" por "/" para obtener "YYYY/MM/DD"
        subscriberIdentityIssue: this.portRequest.transparentData.subscriberIdentityIssue.replace(/-/g, "/"),
        nip: this.portRequest.transparentData.nip,
        subscriberName: this.portRequest.transparentData.subscriberName,
        subscriberAddress: this.portRequest.transparentData.subscriberAddress,
        subscriberServiceType: this.portRequest.subscriberServiceType
      }
    };

    this.putPortInRequestService.sendPortInRequest(requestData).subscribe({
      next: response => {
        console.log('Solicitud de portabilidad enviada con éxito:', response);
        Swal.fire({
          icon: 'success',
          title: 'Solicitud enviada',
          text: 'Tu solicitud de portabilidad ha sido enviada exitosamente.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/home']);
        });
      },
      error: error => {
        console.error('Error al enviar la solicitud de portabilidad:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Ocurrió un error al enviar la solicitud.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onlyNumber(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
