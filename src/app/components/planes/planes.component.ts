import { Component, OnInit } from '@angular/core';
import { ProductOfferingService } from '../../services/product-offering.service';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export class PlanesComponent implements OnInit {
  plans: any[] = [];
  currentIndex: number = 0;

  constructor(private productService: ProductOfferingService) {}

  ngOnInit(): void {
    this.productService.getProductOffering().subscribe(data => {
      this.plans = data.plans;
    });
  }

  nextSlide(): void {
    if (this.plans.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.plans.length;
    }
  }

  prevSlide(): void {
    if (this.plans.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.plans.length) % this.plans.length;
    }
  }

  getClass(i: number): string {
    if (i === this.currentIndex) {
      return 'active';
    } else if (i === (this.currentIndex - 1 + this.plans.length) % this.plans.length) {
      return 'prev';
    } else if (i === (this.currentIndex + 1) % this.plans.length) {
      return 'next';
    } else {
      return 'hidden';
    }
  }
}
