import { Component, OnInit  } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  showContactInfo: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los eventos de navegación para ocultar el menú cuando se redirige
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showContactInfo = false;
      }
    });
  }

  toggleInfo(event: Event, type: string): void {
    event.preventDefault();
    // Solo manejamos la opción "contactanos" en este ejemplo
    if (type === 'contactanos') {
      this.showContactInfo = !this.showContactInfo;
    }
  }

}
