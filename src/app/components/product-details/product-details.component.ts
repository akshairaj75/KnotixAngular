import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { RelatedProductsComponent } from '../related-products/related-products.component';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterLink, RelatedProductsComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product = signal<Product | undefined>(undefined);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    // Listen to route changes. This is critical because when a user clicks on a 
    // related product, we navigate to the same route with a different ID.
    // ActivatedRoute.paramMap ensures the component re-fetches data without reloading.
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        const id = parseInt(idStr, 10);
        this.loadProduct(id);
      } else {
        this.errorMessage.set('Invalid Product ID');
        this.isLoading.set(false);
      }
    });
  }

  private loadProduct(id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        if (prod) {
          this.product.set(prod);
          this.titleService.setTitle(`${prod.name} | Aura Jewels`);
        } else {
          this.errorMessage.set('Product not found.');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching product details', err);
        this.errorMessage.set('Could not load product details.');
        this.isLoading.set(false);
      }
    });
  }
}
