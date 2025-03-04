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
export class PortOnComponent implements OnInit {
  phoneNumberToPort: string = '';
  CurrentPhoneNumber: string = '';
  // Campo para los últimos 4 dígitos del serial de la SIM
  simLast4: string = '';

  subscriberId: number | null = null;
  operatorCode: string | null = null;

  constructor(
    private router: Router,
    private getCustomersBySubscriptionService: GetCustomersBySubscriptionService,
    private getNetworkOperatorService: GetNetworkOperatorService,
    private postSendAuthenticationService: PostSendAuthenticationService
  ) {}

  ngOnInit(): void {
    // Suscribirse para obtener el Subscriber ID
    this.getCustomersBySubscriptionService.subscriberId$.subscribe((id) => {
      this.subscriberId = id;
      // Si ya tenemos un número a portar, llamamos a getOperator
      if (id !== null && this.phoneNumberToPort) {
        this.getNetworkOperatorService.getOperator(this.phoneNumberToPort).subscribe();
      }
    });

    // Suscribirse para obtener el Operator Code
    this.getNetworkOperatorService.operatorCode$.subscribe((code) => {
      this.operatorCode = code;
    });
  }

  onSubmit(): void {
    // Validar formato del número a portar
    if (this.phoneNumberToPort.length >= 10 && this.phoneNumberToPort.length <= 12) {
      if (this.phoneNumberToPort.length === 10) {
        this.phoneNumberToPort = '57' + this.phoneNumberToPort;
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: 'El número a portar debe tener entre 10 y 12 dígitos.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validar formato del número DirecTV
    if (this.CurrentPhoneNumber.length >= 10 && this.CurrentPhoneNumber.length <= 12) {
      if (this.CurrentPhoneNumber.length === 10) {
        this.CurrentPhoneNumber = '57' + this.CurrentPhoneNumber;
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: 'El número DirecTV debe tener entre 10 y 12 dígitos.',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => this.resetFormData());
      return;
    }

    // 1. Validar que el usuario exista (getCustomerData)
    this.getCustomersBySubscriptionService.getCustomerData(this.CurrentPhoneNumber).subscribe({
      next: (response) => {
        const subscriptions = response.payload?.subscriptions;
        if (!subscriptions || subscriptions.length === 0 || !subscriptions[0].iccid) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo obtener la información del cliente.',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => this.resetFormData());
          return;
        }
        // 2. Validar que los 4 últimos dígitos del ICCID coincidan
        const iccid: string = subscriptions[0].iccid;       
        const expectedSimLast4 = iccid.slice(-4);
        if (this.simLast4 !== expectedSimLast4) {
          Swal.fire({
            title: 'Identificación fallida',
            text: 'Los últimos 4 dígitos del serial de tu SIM no coinciden, por favor verifica e intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => this.resetFormData());
          return;
        }
        // 3. Validar que el número a portar retorne un operator code
        this.getNetworkOperatorService.getOperator(this.phoneNumberToPort).subscribe({
          next: () => {
            if (!this.operatorCode) {
              Swal.fire({
                title: 'Error',
                text: 'No podemos reconocer el número que quieres portar a DirecTV, verifica nuevamente.',
                icon: 'error',
                confirmButtonText: 'OK'
              }).then(() => this.resetFormData());
              return;
            }
            // Si todo es correcto, proceder a enviar la autenticación
            this.trySendAuthentication();
          },
          error: (err) => {
            if (err.message === 'Error al obtener operador de red') {
              Swal.fire({
                title: 'Error',
                text: 'No podemos reconocer el número que quieres portar a DirecTV, verifica nuevamente.',
                icon: 'error',
                confirmButtonText: 'OK'
              }).then(() => this.resetFormData());
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al obtener el operador de red.',
                icon: 'error',
                confirmButtonText: 'OK'
              }).then(() => this.resetFormData());
            }
          }
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener la información del cliente.',
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(() => this.resetFormData());
      },
    });
  }

  trySendAuthentication(): void {
    if (this.subscriberId !== null && this.operatorCode !== null && this.phoneNumberToPort) {
      this.postSendAuthenticationService.sendAuthentication(this.subscriberId, this.phoneNumberToPort, this.operatorCode)
        .subscribe({
          next: (response) => {
            if (response.message === 'Error al enviar autenticación NIP') {
              this.handleErrorResponse(response);
            } else {
              Swal.fire({
                title: 'NIP solicitado',
                text: `El NIP ha sido solicitado correctamente para el número ${this.phoneNumberToPort}, Este NIP es un código que te llegará como SMS al número que deseas portar a DirecTV. Revisa tus mensajes de texto con tu SIM de tu operador actual.`,
                icon: 'success',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.resetFormData();
                  this.router.navigate(['/portin-request']);
                }
              });
            }
          },
          error: (err) => {
            Swal.fire({
              title: 'Error en la solicitud de NIP',
              text: 'Ocurrió un problema al procesar la solicitud.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          },
        });
    }
  }

  handleErrorResponse(response: any): void {
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

    const errorMessage =
      errorMessages[response.responseCode] ||
      response.error?.message ||
      'Ocurrió un error desconocido.';

    Swal.fire({
      title: 'Error en la solicitud de NIP',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

  onCancel(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Si cancelas, perderás los datos ingresados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, regresar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetFormData();
        this.router.navigate(['/home']);
      }
    });
  }

  onlyNumber(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  onContinueProcess(): void {
    this.router.navigate(['/port-on-continue']);
  }

  private resetFormData(): void {
    this.phoneNumberToPort = '';
    this.CurrentPhoneNumber = '';
    this.simLast4 = '';
  }
}
