import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']  // Asegúrate de que el nombre esté en plural (styleUrls)
})
export class FooterComponent implements OnInit {
  showContactInfo: boolean = false;

  // Referencia al elemento del menú desplegable
  @ViewChild('contactInfo') contactInfo: ElementRef | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Oculta el menú cuando se inicia una navegación
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showContactInfo = false;
      }
    });
  }

  toggleInfo(event: Event, type: string): void {
    event.preventDefault();
    if (type === 'contactanos') {
      this.showContactInfo = !this.showContactInfo;
      // Si se activa el menú, esperar a que se renderice y desplazar la vista
      if (this.showContactInfo) {
        setTimeout(() => {
          if (this.contactInfo) {
            this.contactInfo.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100); // Ajusta el tiempo si es necesario
      }
    }
  }
}
