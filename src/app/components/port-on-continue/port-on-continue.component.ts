import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GetCustomersBySubscriptionService } from '../../services/get-customers-by-subscription.service';
import { GetNetworkOperatorService } from '../../services/get-network-operator-code.service';
import { PostSendAuthenticationService } from '../../services/post-send-authentication.service';

@Component({
  selector: 'app-port-on-continue',
  templateUrl: './port-on-continue.component.html',
  styleUrls: ['./port-on-continue.component.scss']
})
export class PortOnContinueComponent implements OnInit {
  phoneNumberToPort: string = '';
  CurrentPhoneNumber: string = '';

  subscriberId: number | null = null;
  operatorCode: string | null = null;

  constructor(
    private router: Router,
    private getCustomersBySubscriptionService: GetCustomersBySubscriptionService,
    private getNetworkOperatorService: GetNetworkOperatorService,
    private postSendAuthService: PostSendAuthenticationService
  ) {}

  ngOnInit(): void {
    // Suscribirse para obtener subscriberId
    this.getCustomersBySubscriptionService.subscriberId$.subscribe(id => {
      this.subscriberId = id;
    });
    // Suscribirse para obtener operatorCode
    this.getNetworkOperatorService.operatorCode$.subscribe(code => {
      if (code !== null) {
        this.operatorCode = code;
      }
    });
  }

  onContinueProcess(): void {
    // Validar que el número a portar tenga longitud válida
    if (!this.phoneNumberToPort || this.phoneNumberToPort.length < 10 || this.phoneNumberToPort.length > 12) {
      Swal.fire({
        title: 'Error',
        text: 'El número a portar es inválido.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    // Agregar prefijo si es necesario
    if (this.phoneNumberToPort.length === 10) {
      this.phoneNumberToPort = '57' + this.phoneNumberToPort;
    }
    // Validar que el número DirecTV sea válido (aunque en este formulario no se usa para la autenticación)
    if (!this.CurrentPhoneNumber || this.CurrentPhoneNumber.length < 10 || this.CurrentPhoneNumber.length > 12) {
      Swal.fire({
        title: 'Error',
        text: 'El número DirecTV es inválido.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.CurrentPhoneNumber.length === 10) {
      this.CurrentPhoneNumber = '57' + this.CurrentPhoneNumber;
    }

    // 1. Validar que el usuario existe usando getCustomerData
    this.getCustomersBySubscriptionService.getCustomerData(this.CurrentPhoneNumber).subscribe({
      next: (response) => {
        const subscriptions = response.payload?.subscriptions;
        if (subscriptions && subscriptions.length > 0) {
          // 2. Llamar a getOperator para obtener el operatorCode (donorOperator)
          this.getNetworkOperatorService.getOperator(this.phoneNumberToPort).subscribe({
            next: () => {
              if (this.operatorCode) {
                // 3. Actualizar el observable en el servicio de autenticación con el donorOperator
                this.postSendAuthService.updateDonorOperator(this.operatorCode);                
                this.postSendAuthService.updatephoneNumber(this.phoneNumberToPort);

              
                // Redirigir al componente portin-request para continuar el proceso
                this.router.navigate(['/portin-request']);
              } else {
                Swal.fire({
                  title: 'Error',
                  text: 'No se pudo obtener el operador de red.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
              }
            },
            error: (err) => {
              Swal.fire({
                title: 'Error',
                text: 'No podemos reconocer el número que quieres portar a DirecTV, verifica nuevamente.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo obtener la información del cliente.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener la información del cliente.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
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
    }).then(result => {
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

  private resetFormData(): void {
    this.phoneNumberToPort = '';
    this.CurrentPhoneNumber = '';
  }
}
