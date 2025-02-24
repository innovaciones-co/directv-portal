import { Component } from '@angular/core';
import { QueryImeiService } from '../../services/query-imei.service';
import { PutBlockDeviceByImeiService } from '../../services/put-block-device-by-imei.service';
import { PutBlockSimByNumberService } from '../../services/put-block-sim-by-number.service';
import { GetCustomersBySubscriptionService } from '../../services/get-customers-by-subscription.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { format } from 'date-fns';

@Component({
  selector: 'app-theft',
  templateUrl: './theft.component.html',
  styleUrls: ['./theft.component.scss']
})
export class TheftComponent {
  formData = {
    phoneNumber: '',
    reportDate: '',
    reportType: '',
    address: '',
    city: '',
    name: '',
    phone: '',
    state: '',
    type: '',  // Valor que ingresa el usuario ("C.C", "NIT", etc.)
    id: '',    // Número de documento que ingresa el usuario
    email: '',
    minorVictim: '',
    violenceApplied: '',
    weaponApplied: ''
  };

  // Listado de estados y ciudades de Colombia (simplificado)
  states: string[] = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C', 'Bolívar', 'Boyacá', 'Caldas',
    'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía',
    'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander',
    'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre',
    'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
  ];

  cities: { [key: string]: string[] } = {
    'Amazonas': ['Leticia'],
    'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro', 'Apartadó', 'Turbo', 'Caucasia'],
    'Arauca': ['Arauca'],
    'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga'],
    'Bogotá D.C': ['Bogotá'],
    'Bolívar': ['Cartagena', 'Magangué', 'Turbaco'],
    'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá'],
    'Caldas': ['Manizales', 'La Dorada', 'Chinchiná'],
    'Caquetá': ['Florencia'],
    'Casanare': ['Yopal'],
    'Cauca': ['Popayán', 'Santander de Quilichao'],
    'Cesar': ['Valledupar', 'Aguachica'],
    'Chocó': ['Quibdó'],
    'Córdoba': ['Montería', 'Lorica', 'Sahagún'],
    'Cundinamarca': ['Soacha', 'Fusagasugá', 'Girardot', 'Chía', 'Zipaquirá'],
    'Guainía': ['Inírida'],
    'Guaviare': ['San José del Guaviare'],
    'Huila': ['Neiva', 'Pitalito', 'Garzón'],
    'La Guajira': ['Riohacha', 'Maicao', 'Uribia'],
    'Magdalena': ['Santa Marta', 'Ciénaga'],
    'Meta': ['Villavicencio', 'Acacías', 'Granada'],
    'Nariño': ['Pasto', 'Ipiales', 'Tumaco'],
    'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona'],
    'Putumayo': ['Mocoa'],
    'Quindío': ['Armenia'],
    'Risaralda': ['Pereira', 'Dosquebradas'],
    'San Andrés y Providencia': ['San Andrés'],
    'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja'],
    'Sucre': ['Sincelejo'],
    'Tolima': ['Ibagué', 'Espinal'],
    'Valle del Cauca': ['Cali', 'Buenaventura', 'Palmira', 'Tuluá', 'Buga', 'Cartago'],
    'Vaupés': ['Mitú'],
    'Vichada': ['Puerto Carreño']
  };

  showWeaponType: boolean = false;
  acceptPolicy = false;

  imeiList: { imei: string }[] = [];
  selectedImei: string | null = null;

  // Mapeo para convertir el valor diligenciado por el usuario en el campo Tipo de documento
  // a lo que retorna el servicio.
  private documentTypeMapping: { [key: string]: string } = {
    "C.C": "ID",
    "NIT": "NIT",
    "C.E": "FOREIGN_ID",
    "PASSPORT": "PASSPORT"
  };

  constructor(
    private queryImeiService: QueryImeiService,
    private blockDeviceService: PutBlockDeviceByImeiService,
    private blockSimService: PutBlockSimByNumberService,
    private getCustomerService: GetCustomersBySubscriptionService,
    private router: Router
  ) {}

  onCityChange() {
    for (let state in this.cities) {
      if (this.cities[state].includes(this.formData.city)) {
        this.formData.state = state;
        break;
      }
    }
  }

  onStateChange() {
    if (this.formData.state === 'Bogotá D.C') {
      this.formData.city = 'Bogotá';
    } else {
      this.formData.city = '';
    }
  }

  onPhoneNumberChange() {
    let phoneNumber = this.formData.phoneNumber.trim();

    // Validar longitud del número antes de agregar el '57'
    if (phoneNumber.length >= 10 && phoneNumber.length <= 12) {
      if (phoneNumber.length === 10) {
        phoneNumber = '57' + phoneNumber;
      }
    }
    this.formData.phoneNumber = phoneNumber;

    if (phoneNumber.length === 12) {
      this.imeiList = [];
      this.queryImeiService.queryImei({ phoneNumber }).subscribe(
        response => {
          if (response.payload?.imei) {
            this.imeiList.push({ imei: response.payload.imei });
          } else {
            this.showNoImeiAlert();
          }
        },
        error => {
          this.showErrorAlert();
        }
      );
    }
  }

  showNoImeiAlert() {
    Swal.fire({
      icon: 'warning',
      title: 'No hay IMEIs asociados',
      text: 'Parece que no tienes IMEIs asociados a tu línea DirecTV. No puedes continuar el proceso por este medio. Por favor, contacta con un agente.',
      confirmButtonText: 'OK'
    }).then(() => {
      this.router.navigate(['/theft']);
    });
  }

  showErrorAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Número no válido',
      text: 'Parece que el número ingresado no tiene asociado un IMEI o no es de DirecTV.',
      confirmButtonText: 'OK'
    }).then(() => {
      this.formData.phoneNumber = '';
    });
  }

  onViolenceChange() {
    this.showWeaponType = this.formData.violenceApplied === 'SI';
  }

  // Modificación de onSubmit para validar identificación antes de continuar
  onSubmit(): void {
    // Primero, consumimos el servicio para obtener la información del cliente
    this.getCustomerService.getCustomerData(this.formData.phoneNumber).subscribe({
      next: response => {
        if (response && response.payload && response.payload.document) {
          const customerDocument = response.payload.document;
          const expectedDocType = this.documentTypeMapping[this.formData.type] || this.formData.type;
          if (customerDocument.id === this.formData.id && customerDocument.type === expectedDocType) {
            // Si la identificación coincide, procedemos con el proceso de bloqueo

            if (!this.selectedImei) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes seleccionar un IMEI antes de continuar.',
                confirmButtonText: 'OK'
              });
              return;
            }

            const reportDate = new Date();
            const formattedReportDate = format(reportDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

            const reportTypeMapping: { [key: string]: string } = {
              'Hurto': 'THEFT_DEVICE',
              'Extravío': 'LOST_DEVICE'
            };

            const documentTypeMapping: { [key: string]: number } = {
              'C.C': 1,
              'NIT': 2,
              'FOREIGN_ID': 3,
              'PASSPORT': 4
            };

            const weaponTypeMapping: { [key: string]: string } = {
              'Arma de fuego': 'FIREARM',
              'Arma blanca': 'BLADE'
            };

            const requestData = {
              phoneNumber: this.formData.phoneNumber,
              imei: this.selectedImei,
              eventDate: this.formData.reportDate ? format(new Date(this.formData.reportDate), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : null,
              reportDate: formattedReportDate,
              reportType: reportTypeMapping[this.formData.reportType] || 'ADMINISTRATIVE_BLOCKING',
              reporter: {
                address: this.formData.address,
                city: this.formData.city,
                name: this.formData.name,
                phone: this.formData.phone,
                state: this.formData.state
              },
              reporterDocument: {
                id: this.formData.id,
                type: documentTypeMapping[this.formData.type] || 1
              },
              victimEmail: this.formData.email,
              victimMinor: this.formData.minorVictim === 'SI',
              violenceApplied: this.formData.violenceApplied === 'SI',
              weaponApplied: weaponTypeMapping[this.formData.weaponApplied] || null
            };

            this.blockDeviceService.blockDeviceByImei(requestData).subscribe({
              next: response => {
                console.log('Bloqueo de dispositivo exitoso:', response);
                this.blockSimService.blockSimByPhoneNumber({ phoneNumber: this.formData.phoneNumber }).subscribe({
                  next: simResponse => {
                    console.log('Bloqueo de SIM exitoso:', simResponse);
                    Swal.fire({
                      icon: 'success',
                      title: 'Bloqueo exitoso',
                      text: 'El bloqueo del dispositivo y la SIM se realizaron con éxito.',
                      confirmButtonText: 'OK'
                    }).then(() => {
                      this.router.navigate(['/home']);
                    });
                  },
                  error: simError => {
                    console.error('Error en el bloqueo de la SIM:', simError);
                    Swal.fire({
                      icon: 'error',
                      title: 'Error en el bloqueo de la SIM',
                      text: 'El bloqueo del dispositivo fue exitoso, pero hubo un problema con el bloqueo de la SIM.',
                      confirmButtonText: 'OK'
                    }).then(() => {
                      this.router.navigate(['/home']);
                    });
                  }
                });
              },
              error: error => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error en el bloqueo',
                  text: 'Hubo un problema al intentar bloquear el dispositivo.',
                  confirmButtonText: 'OK'
                });
              }
            });
          } else {
            // Si la identificación no coincide, mostramos un error y reiniciamos el formulario
            Swal.fire({
              icon: 'error',
              title: 'Identificación fallida',
              text: 'Los datos de identificación no coinciden, por favor verifique e intente de nuevo.',
              confirmButtonText: 'OK'
            }).then(() => {
              // Reiniciamos los campos críticos del formulario
              this.formData.id = '';
              this.formData.type = '';
              // También podrías reiniciar el formulario completo según tu lógica
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener la información del cliente.',
            confirmButtonText: 'OK'
          });
        }
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener la información del cliente.',
          confirmButtonText: 'OK'
        });
      }
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
