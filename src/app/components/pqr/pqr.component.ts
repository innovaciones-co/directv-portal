import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CreateTroubleTicketService } from '../../services/post-create-troubleticket.service';

export interface CategoryOption {
  id: string;
  name: string;
  indent?: number; // opcional: para indicar el nivel (0 = grupo, 1 = subcategoría)
}

// Arreglos fijos con dos niveles jerárquicos para cada presentación

// Arreglo para "Petición" – con dos niveles: grupo y subcategorías
const PETICION: CategoryOption[] = [
  { id: "3041", name: "Petición" },
  { id: "3129", name: "Calidad / Cobertura del Servicio" },
    { id: "3137", name: "   Calidad del Sonido" },
    { id: "3140", name: "   SMS Códigos Cortos" },
    { id: "3141", name: "   SMS Persona a Persona" },
    { id: "3142", name: "   Whatsapp CHAT" },
    { id: "3144", name: "   RNE (Registro de Números Excluídos)" },
    { id: "3131", name: "   Caída de llamadas" },
    { id: "3135", name: "   Suspensión del servicio sin justa causa" },
    { id: "3136", name: "   Disponibilidad del servicio por falla técnica" },
    { id: "3216", name: "   Intermitencia voz" },
    { id: "3133", name: "   Intento de llamada no exitosa" },
    { id: "3130", name: "   No disponibilidad del servicio" },
    { id: "3132", name: "   Timbra y no repica" },
    { id: "3139", name: "   Intermitencia datos" },
    { id: "3143", name: "   No compensación informada" },
  { id: "3160", name: "Otros" },
    { id: "3162", name: "   Requerimientos Judiciales" },
    { id: "3164", name: "   Silencio Administrativo" },
    { id: "3166", name: "   Otros" },
    { id: "3116", name: "   Cumplimiento de una orden de la SIC" },
    { id: "3163", name: "   Principio de neutralidad en internet" },
    { id: "3165", name: "   Roaming Internacional" },
  { id: "3083", name: "Servicios Generales" },
    { id: "3089", name: "   Compra de paquetes Datos" },
    { id: "3091", name: "   Solicitud Chip de Reposición" },
    { id: "3084", name: "   Activación de línea" },
    { id: "3087", name: "   Cancelación de Plan" },
    { id: "3085", name: "   Compra de Plan" },
    { id: "3088", name: "   Compra de paquetes Voz" },
    { id: "3171", name: "   Cambio de Plan" },
    { id: "3090", name: "   Prender / Apagar Datos" },
    { id: "3177", name: "   Solicitud número privado" },
    { id: "3093", name: "   Cambio de número" },
  { id: "3110", name: "Gestión de Saldos" },
    { id: "3112", name: "   Consulta de saldo" },
    { id: "3114", name: "   Ajustes a favor del usuario" },
    { id: "3115", name: "   Cobro o descuento injustificado" },
    { id: "3113", name: "   Solicitud saldo de emergencia" },
    { id: "3117", name: "   Vigencia de saldos" },
    { id: "3116", name: "   Información sobre Transferencia de saldo a otros DIRECTV" },
  { id: "3094", name: "Información y/o condiciones prestación del servicio" },
    { id: "3104", name: "   Modificación condiciones acordadas" },
    { id: "3108", name: "   Protección de Datos Personales" },
    { id: "3105", name: "   Publicidad Engañosa" },
    { id: "3095", name: "   Información servicios DIRECTV (compra, recarga...)" },
    { id: "3096", name: "   Información Planes y paquetes" },
    { id: "3099", name: "   Aclaración/Información producto actual activo" },
    { id: "3109", name: "   Incremento tarifario" },
    { id: "3102", name: "   Solicitud reporte tráfico" },
    { id: "3101", name: "   Actualización de datos" },
    { id: "3103", name: "   Solicitud factura recarga" },
    { id: "3182", name: "   Información Tarifas por demanda" },
    { id: "3183", name: "   Información Consumo línea" },
    { id: "3100", name: "   Información LDI" },
    { id: "3106", name: "   Publicidad y/o oferta sobre los servicios ofrecidos" },
    { id: "3107", name: "   Servicios no solicitados" },
  { id: "3120", name: "Portabilidad" },
    { id: "3119", name: "   Port In" },
  { id: "3157", name: "Información PQR" },
    { id: "3158", name: "   Estado CUN" },
    { id: "3159", name: "   Estado PQR" },
  { id: "3121", name: "Equipos terminales" },
    { id: "3122", name: "   Registro IMEI" },
    { id: "3125", name: "   Homologación" },
    { id: "3124", name: "   Desbloqueo IMEI" },
    { id: "3128", name: "   Cesión de Equipo" },
    { id: "3209", name: "   Hurto o Extravío / Bloqueo IMEI" },
    { id: "3227", name: "   Revisión Especificaciones Equipos" },
    { id: "3211", name: "   Estado IMEI" },
  { id: "3145", name: "Medios de atención al usuario" },
    { id: "3146", name: "   Línea de Atención Telefónica" },
    { id: "3149", name: "   Correo Electrónico" },
    { id: "3151", name: "   USSD" },
    { id: "3152", name: "   Página WEB" },
    { id: "3231", name: "   Chat página web" },
    { id: "3148", name: "   Facebook" },
    { id: "3150", name: "   IVR" },
  { id: "3153", name: "Terminación del Contrato" },
    { id: "3154", name: "   Cesión de Contrato" },
    { id: "3155", name: "   Imposibilidad terminación contrato" },
    { id: "3156", name: "   Fraudes en contratación - Suplantación de Identidad" }
];

// Arreglo para "Queja/Reclamo"
const QUEJA_RECLAMO: CategoryOption[] = [
  { id: "3167", name: "Queja/Reclamo" },
  { id: "3205", name: "Equipos terminales" },
    { id: "3125", name: "   Homologación" },
    { id: "3122", name: "   Registro IMEI" },
    { id: "3124", name: "   Desbloqueo IMEI" },
    { id: "3128", name: "   Cesión de Equipo" },
    { id: "3209", name: "   Hurto o Extravío / Bloqueo IMEI" },
    { id: "3227", name: "   Revisión Especificaciones Equipos" },
    { id: "3211", name: "   Estado IMEI" },
  { id: "3094", name: "Información y/o condiciones prestación del servicio" },
    { id: "3104", name: "   Modificación condiciones acordadas" },
  { id: "3110", name: "Gestión de Saldos" },
    { id: "3112", name: "   Consulta de saldo" },
    { id: "3114", name: "   Ajustes a favor del usuario" },
    { id: "3115", name: "   Cobro o descuento injustificado" },
    { id: "3113", name: "   Solicitud saldo de emergencia" },
    { id: "3117", name: "   Vigencia de saldos" },
    { id: "3116", name: "   Información sobre Transferencia de saldo a otros DIRECTV" },
  { id: "3083", name: "Servicios Generales" },
    { id: "3171", name: "   Cambio de Plan" },
    { id: "3174", name: "   Compra de paquetes Datos" },
    { id: "3177", name: "   Solicitud número privado" },
    { id: "3084", name: "   Activación de línea" },
    { id: "3087", name: "   Cancelación de Plan" },
    { id: "3085", name: "   Compra de Plan" },
    { id: "3090", name: "   Prender / Apagar Datos" },
    { id: "3093", name: "   Cambio de número" },
    { id: "3091", name: "   Solicitud Chip de Reposición" },
  { id: "3129", name: "Calidad / Cobertura del Servicio" },
    { id: "3142", name: "   Whatsapp CHAT" },
    { id: "3137", name: "   Calidad del Sonido" },
    { id: "3140", name: "   SMS Códigos Cortos" },
    { id: "3141", name: "   SMS Persona a Persona" },
    { id: "3144", name: "   RNE (Registro de Números Excluídos)" },
    { id: "3131", name: "   Caída de llamadas" },
    { id: "3135", name: "   Suspensión del servicio sin justa causa" },
    { id: "3136", name: "   Disponibilidad del servicio por falla técnica" },
    { id: "3216", name: "   Intermitencia voz" },
    { id: "3133", name: "   Intento de llamada no exitosa" },
    { id: "3130", name: "   No disponibilidad del servicio" },
    { id: "3132", name: "   Timbra y no repica" },
    { id: "3139", name: "   Intermitencia datos" },
    { id: "3143", name: "   No compensación informada" },
  { id: "3145", name: "Medios de atención al usuario" },
    { id: "3146", name: "   Línea de Atención Telefónica" },
    { id: "3150", name: "   IVR" },
    { id: "3148", name: "   Facebook" },
    { id: "3231", name: "   Chat página web" },
    { id: "3233", name: "   Correo Electrónico" },
    { id: "3235", name: "   USSD" },
  { id: "3153", name: "Terminación del Contrato" },
    { id: "3154", name: "   Cesión de Contrato" },
    { id: "3155", name: "   Imposibilidad terminación contrato" },
    { id: "3156", name: "   Fraudes en contratación - Suplantación de Identidad" },
  { id: "3157", name: "Información PQR" },
    { id: "3158", name: "   Estado PQR" },
    { id: "3159", name: "   Estado CUN" }
];

// Arreglo para "Recurso"
const RECURSO: CategoryOption[] = [
  { id: "3252", name: "Recursos" },
  { id: "3253", name: "Recurso de Reposición" },
  { id: "3254", name: "Recurso de Reposición en subsidio de apelación" }
];

@Component({
  selector: 'app-pqr',
  templateUrl: './pqr.component.html',
  styleUrls: ['./pqr.component.scss']
})
export class PqrComponent implements OnInit {
  formData: any = {
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
    complaintTitle: '',
    complaintDescription: '',
    presentationType: '',
    categoryId: '',
    acceptPolicy: false
  };

  presentationTypes = [
    { value: 'peticion', label: 'Petición' },
    { value: 'queja', label: 'Queja / Reclamo' },
    { value: 'recurso', label: 'Recurso' }
  ];

  currentCategories: CategoryOption[] = [];

  departments: string[] = [];
  cities: { [key: string]: string[] } = {};

  constructor(private createTicketService: CreateTroubleTicketService) {}

  ngOnInit(): void {
    this.departments = [
      "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas",
      "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca",
      "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño",
      "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia",
      "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada", "Distrito Capital"
    ];

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
    this.formData.city = '';
  }

  // Cuando se cambia la presentación, asigna el arreglo correspondiente a currentCategories
  onPresentationChange(): void {
    if (this.formData.presentationType === 'peticion') {
      this.currentCategories = PETICION;
    } else if (this.formData.presentationType === 'queja') {
      this.currentCategories = QUEJA_RECLAMO;
    } else if (this.formData.presentationType === 'recurso') {
      this.currentCategories = RECURSO;
    } else {
      this.currentCategories = [];
    }
  }

    // Función para permitir solo números en los campos
    onlyNumber(event: KeyboardEvent): void {
      const charCode = event.charCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    }

  onSubmit(form: NgForm): void {
    if (form.valid && this.formData.acceptPolicy) {
      if (!this.formData.contactPhone.startsWith('57')) {
        this.formData.contactPhone = '57' + this.formData.contactPhone;
      }
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
