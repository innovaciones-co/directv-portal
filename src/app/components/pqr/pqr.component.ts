import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GetTroubleTicketCategoriesService } from '../../services/get-toubleticket-categories.service';
import { CreateTroubleTicketService } from '../../services/post-create-troubleticket.service';


@Component({
  selector: 'app-pqr',
  templateUrl: './pqr.component.html',
  styleUrls: ['./pqr.component.scss']
})
export class PqrComponent implements OnInit {
  formData: any = {
    // Información de contacto
    firstName: '',
    lastName: '',
    documentType: '',
    documentNumber: '',
    email: '',
    contactPhone: '',
    department: '',
    city: '',
    neighborhood: '',
    address: '',
    // Información de queja
    complaintTitle: '',
    complaintDescription: '',
    categoryId: '',
    // Validación
    acceptPolicy: false
  };

  categories: any[] = [];
  departments: string[] = [];
  cities: { [key: string]: string[] } = {};

  constructor(
    private getCategoriesService: GetTroubleTicketCategoriesService,
    private createTicketService: CreateTroubleTicketService
  ) {}

  ngOnInit(): void {
    // Cargar categorías desde el servicio
    this.getCategoriesService.getTroubleTicketCategories().subscribe(response => {
      if (
        response &&
        response['ser:categories'] &&
        response['ser:categories']['ser:category']
      ) {
        let cats = response['ser:categories']['ser:category'];
        if (!Array.isArray(cats)) {
          cats = [cats];
        }
        this.categories = cats;
      }
    }, error => {
      console.error('Error fetching categories:', error);
    });

    // Listado de departamentos de Colombia
    this.departments = [
      "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas", 
      "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", 
      "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", 
      "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia", 
      "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada", "Distrito Capital"
    ];

    // Ejemplo de ciudades para cada departamento
    this.cities = {
      "Amazonas": ["Leticia"],
      "Antioquia": ["Medellín", "Envigado", "Bello", "Itagüí"],
      "Arauca": ["Arauca"],
      "Atlántico": ["Barranquilla", "Soledad", "Malambo"],
      "Bolívar": ["Cartagena", "Magangué", "Turbaco"],
      "Boyacá": ["Tunja", "Duitama", "Sogamoso"],
      "Caldas": ["Manizales", "Villamaría"],
      "Caquetá": ["Florencia"],
      "Casanare": ["Yopal"],
      "Cauca": ["Popayán", "Sotará", "Puerto Tejada"],
      "Cesar": ["Valledupar", "Agustín Codazzi"],
      "Chocó": ["Quibdó", "Istmina"],
      "Córdoba": ["Montería", "Lorica"],
      "Cundinamarca": ["Bogotá", "Soacha", "Chía", "Zipaquirá"],
      "Guainía": ["Inírida"],
      "Guaviare": ["San José del Guaviare"],
      "Huila": ["Neiva", "Pitalito"],
      "La Guajira": ["Riohacha", "Maicao"],
      "Magdalena": ["Santa Marta", "Ciénaga"],
      "Meta": ["Villavicencio", "Acacías"],
      "Nariño": ["Pasto", "Tumaco"],
      "Norte de Santander": ["Cúcuta", "Ocaña"],
      "Putumayo": ["Mocoa", "Puerto Asís"],
      "Quindío": ["Armenia", "Calarcá"],
      "Risaralda": ["Pereira", "Dosquebradas"],
      "San Andrés y Providencia": ["San Andrés"],
      "Santander": ["Bucaramanga", "Floridablanca"],
      "Sucre": ["Sincelejo", "Corozal"],
      "Tolima": ["Ibagué", "Espinal"],
      "Valle del Cauca": ["Cali", "Buenaventura", "Jamundí"],
      "Vaupés": ["Mitú"],
      "Vichada": ["Puerto Carreño"],
      "Distrito Capital": ["Bogotá"]
    };
  }

  onDepartmentChange(): void {
    // Al cambiar de departamento se limpia la ciudad
    this.formData.city = '';
  }

  onSubmit(form: NgForm): void {
    if (form.valid && this.formData.acceptPolicy) {
      // Verificar que el número de contacto comience con "57"
      if (!this.formData.contactPhone.startsWith('57')) {
        this.formData.contactPhone = '57' + this.formData.contactPhone;
      }

      // Combinar la información de contacto y la queja en la descripción
      const description = `
Información de contacto:
Nombre / Razón Social: ${this.formData.firstName}
Apellido: ${this.formData.lastName}
Tipo de documento: ${this.formData.documentType}
Número de documento: ${this.formData.documentNumber}
Correo electrónico: ${this.formData.email}
Teléfono de contacto: ${this.formData.contactPhone}
Departamento: ${this.formData.department}
Municipio/Ciudad: ${this.formData.city}
Barrio: ${this.formData.neighborhood}
Dirección: ${this.formData.address}

Queja:
Título: ${this.formData.complaintTitle}
Descripción: ${this.formData.complaintDescription}
      `;
      // Preparar los datos a enviar
      const ticketData = {
        msisdn: this.formData.contactPhone,
        title: this.formData.complaintTitle,
        description: description,
        categoryId: this.formData.categoryId
      };

      this.createTicketService.createTroubleTicket(ticketData).subscribe(
        response => {
          console.log('Trouble Ticket created:', response);
          form.resetForm();
        },
        error => {
          console.error('Error creating Trouble Ticket:', error);
        }
      );
    } else {
      console.error('Formulario inválido o la política no fue aceptada');
    }
  }
}