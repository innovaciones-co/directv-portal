import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { GetCustomersBySubscriptionService } from '../../services/get-customers-by-subscription.service';
import { GetNetworkOperatorService } from '../../services/get-network-operator-code.service';
import { PostSendAuthenticationService } from '../../services/post-send-authentication.service';

@Component({
  selector: 'app-port-on',
  templateUrl: './port-on.component.html',
  styleUrls: ['./port-on.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortOnComponent {
  phoneNumberToPort = '';
  CurrentPhoneNumber = '';
  simLast4 = '';

  private readonly subscriberId = signal<number | null>(null);
  private readonly operatorCode = signal<string | null>(null);

  private readonly router = inject(Router);
  private readonly customersService = inject(GetCustomersBySubscriptionService);
  private readonly networkOperatorService = inject(GetNetworkOperatorService);
  private readonly authService = inject(PostSendAuthenticationService);

  constructor() {
    this.customersService.subscriberId$.pipe(takeUntilDestroyed()).subscribe((id) => {
      this.subscriberId.set(id);
      if (id !== null && this.phoneNumberToPort) {
        this.networkOperatorService.getOperator(this.phoneNumberToPort).subscribe();
      }
    });

    this.networkOperatorService.operatorCode$
      .pipe(takeUntilDestroyed())
      .subscribe((code) => this.operatorCode.set(code));
  }

  onSubmit(): void {
    const normalizedPort = this.normalizePhone(this.phoneNumberToPort);
    if (!normalizedPort) {
      this.showError('El número a portar debe tener entre 10 y 12 dígitos.');
      return;
    }
    this.phoneNumberToPort = normalizedPort;

    const normalizedCurrent = this.normalizePhone(this.CurrentPhoneNumber);
    if (!normalizedCurrent) {
      this.showError('El número DirecTV debe tener entre 10 y 12 dígitos.').then(() => this.resetFormData());
      return;
    }
    this.CurrentPhoneNumber = normalizedCurrent;

    this.customersService.getCustomerData(this.CurrentPhoneNumber).subscribe({
      next: (response) => {
        const subscriptions = response.payload?.subscriptions;
        if (!subscriptions?.length || !subscriptions[0].iccid) {
          this.showError('No se pudo obtener la información del cliente.').then(() => this.resetFormData());
          return;
        }

        if (this.simLast4 !== (subscriptions[0].iccid as string).slice(-4)) {
          this.showError(
            'Los últimos 4 dígitos del serial de tu SIM no coinciden, por favor verifica e intenta de nuevo.',
            'Identificación fallida'
          ).then(() => this.resetFormData());
          return;
        }

        this.networkOperatorService.getOperator(this.phoneNumberToPort).subscribe({
          next: () => {
            if (!this.operatorCode()) {
              this.showError('No podemos reconocer el número que quieres portar a DirecTV, verifica nuevamente.')
                .then(() => this.resetFormData());
              return;
            }
            this.trySendAuthentication();
          },
          error: () => {
            this.showError('No podemos reconocer el número que quieres portar a DirecTV, verifica nuevamente.')
              .then(() => this.resetFormData());
          },
        });
      },
      error: () => {
        this.showError('No se pudo obtener la información del cliente.').then(() => this.resetFormData());
      },
    });
  }

  trySendAuthentication(): void {
    const subscriberId = this.subscriberId();
    const operatorCode = this.operatorCode();
    if (subscriberId === null || operatorCode === null || !this.phoneNumberToPort) return;

    this.authService.sendAuthentication(subscriberId, this.phoneNumberToPort, operatorCode).subscribe({
      next: (response) => {
        if (response.message === 'Error al enviar autenticación NIP') {
          this.handleErrorResponse(response);
        } else {
          Swal.fire({
            title: 'NIP solicitado',
            text: `El NIP ha sido solicitado correctamente para el número ${this.phoneNumberToPort}, Este NIP es un código que te llegará como SMS al número que deseas portar a DirecTV. Revisa tus mensajes de texto con tu SIM de tu operador actual.`,
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this.resetFormData();
              this.router.navigate(['/portin-request']);
            }
          });
        }
      },
      error: (response) => {
        const err = response.error;
        if (err.message === 'Error al reenviar autenticación NIP') {
          this.handleErrorResponse(err);
        } else {
          this.showError('Ocurrió un problema al procesar la solicitud.', 'Error en la solicitud de NIP');
        }
      },
    });
  }

  handleErrorResponse(response: any): void {
    const errorMessages: Record<number, string> = {
      1020080013: 'La solicitud de portabilidad ya está en curso o ya se ha solicitado el número máximo permitido de NIP.',
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
      1037000001: 'No existe suscripción para el proveedor.',
    };

    const responseCode = response.error.responseCode;
    const errorMessage = errorMessages[responseCode] ?? response.error?.message ?? 'Ocurrió un error desconocido.';
    this.showError(errorMessage, 'Error en la solicitud de NIP');
  }

  onCancel(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Si cancelas, perderás los datos ingresados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, regresar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetFormData();
        this.router.navigate(['/home']);
      }
    });
  }

  onlyNumber(event: KeyboardEvent): void {
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onContinueProcess(): void {
    this.router.navigate(['/port-on-continue']);
  }

  private normalizePhone(phone: string): string | null {
    if (phone.length < 10 || phone.length > 12) return null;
    return phone.length === 10 ? '57' + phone : phone;
  }

  private showError(text: string, title = 'Error'): Promise<SweetAlertResult> {
    return Swal.fire({ title, text, icon: 'error', confirmButtonText: 'OK' });
  }

  private resetFormData(): void {
    this.phoneNumberToPort = '';
    this.CurrentPhoneNumber = '';
    this.simLast4 = '';
  }
}
