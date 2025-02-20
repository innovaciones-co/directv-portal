import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GetCustomersBySubscriptionService } from '../../services/get-customers-by-subscription.service';
import { GetNetworkOperatorService } from '../../services/get-network-operator-code.service';
import { PostSendAuthenticationService } from '../../services/post-send-authentication.service';

@Component({
  selector: 'app-port-on',
  templateUrl: './port-on.component.html',
  styleUrls: ['./port-on.component.scss'],
})
export class PortOnComponent {
  phoneNumberToPort: string = '';
  CurrentPhoneNumber: string = '';
  subscriberId: number | null = null;
  operatorCode: string | null = null;

  constructor(
    private router: Router,
    private getCustomersBySubscriptionService: GetCustomersBySubscriptionService,
    private getNetworkOperatorService: GetNetworkOperatorService,
    private postSendAuthenticationService: PostSendAuthenticationService
  ) {}

  ngOnInit(): void {
    this.getCustomersBySubscriptionService.subscriberId$.subscribe(id => {
      this.subscriberId = id;
      console.log(`Subscriber ID recibido en el componente: ${id}`);
      if (id !== null) {
        this.getNetworkOperatorService.getOperator(this.phoneNumberToPort).subscribe();
      }
    });

    this.getNetworkOperatorService.operatorCode$.subscribe(code => {
      this.operatorCode = code;
      console.log(`Operator Code recibido en el componente: ${code}`);
      this.trySendAuthentication();
    });
  }

  onSubmit() {
    if (this.phoneNumberToPort.length >= 10 && this.phoneNumberToPort.length <= 12) {
      if (this.phoneNumberToPort.length === 10) {
        this.phoneNumberToPort = '57' + this.phoneNumberToPort;
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: 'El número debe tener entre 10 y 12 dígitos.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (this.CurrentPhoneNumber.length >= 10 && this.CurrentPhoneNumber.length <= 12) {
      if (this.CurrentPhoneNumber.length === 10) {
        this.CurrentPhoneNumber = '57' + this.CurrentPhoneNumber;
      }

      this.getCustomersBySubscriptionService.getCustomerData(this.CurrentPhoneNumber).subscribe({
        next: response => {
          console.log('Datos de suscripción obtenidos:', response);
        },
        error: err => {
          console.error('Error al obtener datos de suscripción:', err);
          if (err?.error?.message === 'Error al obtener datos de suscripción') {
            Swal.fire({
              title: 'Error',
              text: 'Parece que su numero no es DirecTV.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      });

    } else {
      Swal.fire({
        title: 'Error',
        text: 'El número debe tener entre 10 y 12 dígitos.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  trySendAuthentication() {
    if (this.subscriberId !== null && this.operatorCode !== null && this.phoneNumberToPort) {
      this.postSendAuthenticationService.sendAuthentication(this.subscriberId, this.phoneNumberToPort, this.operatorCode).subscribe({
        next: response => {
          console.log(`Response Code: ${response.responseCode}`);

          if (response.message === 'Error al enviar autenticación NIP') {
            this.handleErrorResponse(response);
          } else {
            Swal.fire({
              title: 'NIP solicitado',
              text: `El NIP ha sido solicitado correctamente para el número ${this.phoneNumberToPort}`,
              icon: 'success',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/portin-request']);
              }
            });;
          }
        },
        error: err => {
          console.error('Error al solicitar el NIP:', err);
          Swal.fire({
            title: 'Error en la solicitud de NIP',
            text: 'Ocurrió un problema al procesar la solicitud.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }

  handleErrorResponse(response: any) {
    const errorMessages: { [key: number]: string } = {
      1020080013: 'La solicitud de portabilidad ya está en curso.',
      1000000000: 'Error desconocido del servidor.',
      1000000001: 'Acceso denegado.',
      1000000002: 'La operación no está soportada.',
      1020080010: 'Error en el sistema remoto.',
      1020080011: 'Solicitud inválida.',
      1020080012: 'Error en el aprovisionamiento.',
      1020080014: 'Error en la validación del cliente.',
      1020080015: 'Excepción de servicio interno.',
      1020080099: 'Excepción al procesar la solicitud.',
      1024020001: 'El servicio no está disponible.',
      1024020002: 'El servicio no respondió a tiempo.',
      1024020003: 'Incompatibilidad de versión de API.',
      1024020004: 'Fallo en la búsqueda de referencia del servicio.',
      1024020005: 'Clase de respuesta no aplicable.',
      1024030001: 'Solicitud inválida.',
      1024030002: 'Error interno.',
      1024039999: 'Error ORA desconocido.',
      1037000001: 'No existe suscripción para el proveedor.'
    };

    const errorMessage = errorMessages[response.responseCode] || response.error?.message || 'Ocurrió un error desconocido.';

    Swal.fire({
      title: 'Error en la solicitud de NIP',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  onCancel() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Si cancelas, perderás los datos ingresados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, regresar'
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/home']);
      }
    });
  }
}
