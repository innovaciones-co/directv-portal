import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  menuOpen: boolean = false;
  dropdownStates: { [key: string]: boolean } = {};

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  toggleDropdown(key: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    // Cierra todos los dropdowns excepto el actual
    Object.keys(this.dropdownStates).forEach(k => {
      if (k !== key) {
        this.dropdownStates[k] = false;
      }
    });
    // Alterna el estado del dropdown actual
    this.dropdownStates[key] = !this.dropdownStates[key];
  }
  

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.menuOpen = false;
    this.dropdownStates = {};
  }
}
