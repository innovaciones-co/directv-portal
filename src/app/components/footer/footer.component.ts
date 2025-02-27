import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  showContactInfo: boolean = false;

  toggleInfo(event: Event, type: string): void {
    event.preventDefault();
    // Solo manejamos la opción "contactanos" en este ejemplo
    if (type === 'contactanos') {
      this.showContactInfo = !this.showContactInfo;
    }
  }

}
