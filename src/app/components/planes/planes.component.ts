import { Component,OnInit} from '@angular/core';
import { ProductOfferingService } from '../../services/product-offering.service';


@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.scss'
})
export class PlanesComponent  implements OnInit {
  plans: any[] = [];

  constructor(private productService: ProductOfferingService) {}

  ngOnInit(): void {
    this.productService.getProductOffering().subscribe(data => {
      this.plans = data.plans;
    });
  }
}