import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consult-pqr',
  templateUrl: './consult-pqr.component.html',
  styleUrls: ['./consult-pqr.component.scss']
})
export class ConsultPqrComponent implements OnInit {
  // Renombramos la propiedad para evitar conflictos con index signature
  directvNumber: string = '';
  // Arreglo para almacenar los tickets obtenidos
  tickets: any[] = [];
  // Bandera para mostrar carga
  loading: boolean = false;

  // Propiedades para paginación
  currentPage: number = 1;
  pageSize: number = 6;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  // Permite solo números en el input
  onlyNumber(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  // Método para consultar PQRs a partir del número Directv ingresado
  onConsult(): void {
    // Validación: el número debe tener entre 10 y 12 dígitos; si tiene 10 se le agrega '57'
    if (this.directvNumber.length < 10 || this.directvNumber.length > 12) {
      Swal.fire({
        icon: 'error',
        title: 'Número inválido',
        text: 'El número debe tener entre 10 y 12 dígitos.',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.directvNumber.length === 10) {
      this.directvNumber = '57' + this.directvNumber;
    }

    this.loading = true;
    const url = `https://lov.com.co/api-dtv/getTickedByMsisdn?msisdn=${this.directvNumber}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.loading = false;
        // Se asume que los tickets vienen en response['ser:tickets']['ser:ticket']
        let ticketData = response['ser:tickets']?.['ser:ticket'];
        if (ticketData) {
          // Si viene un solo ticket, se convierte en arreglo
          if (!Array.isArray(ticketData)) {
            ticketData = [ticketData];
          }
          // Mapear los datos a los campos que deseamos mostrar,
          // usando el título del ticket en lugar de la descripción
          this.tickets = ticketData.map((ticket: any) => ({
            id: ticket['ser:ticketId'],
            cun:ticket.cunId,
            categoria: ticket['ser:categoryName']?.trim(),
            descripcion: ticket['ser:title'],
            estado: ticket['ser:status']
          }));
          this.currentPage = 1; // Reiniciar paginación
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Sin resultados',
            text: 'No se encontraron PQR para este número.',
            confirmButtonText: 'OK'
          });
          this.tickets = [];
        }
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al consultar los PQRs.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  // Retorna los tickets de la página actual
  get pagedTickets(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.tickets.slice(startIndex, startIndex + this.pageSize);
  }

  // Calcula el total de páginas
  totalPages(): number {
    return Math.ceil(this.tickets.length / this.pageSize);
  }

  goToPrevious(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNext(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }
}
