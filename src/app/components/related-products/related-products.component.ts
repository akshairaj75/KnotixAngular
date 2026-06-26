import { Component, input, OnInit, OnChanges, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-related-products',
  imports: [CommonModule, RouterLink],
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.css'
})
export class RelatedProductsComponent implements OnInit, OnChanges {
  // Signal inputs (available in Angular 17.1+)
  category = input.required<string>();
  currentProductId = input.required<number>();

  relatedProductsList = signal<Product[]>([]);
  isLoading = signal<boolean>(true);

  // Compute final lists by filtering out the active details product
  filteredRelatedProducts = computed(() => {
    return this.relatedProductsList().filter(p => p.id !== this.currentProductId());
  });

  constructor(private productService: ProductService) {
    // Angular 19 watch() or effect() to re-trigger query when category input changes
    // This handles route changes within the same component (e.g. details A to details B)
    // Wait, in Angular 19 we can use standard effect or write reaction logic inside ngOnInit or a watcher.
    // Let's implement reactive category loading using standard setup.
  }

  ngOnInit(): void {
    // Standard Angular lifecycle: we will trigger category load.
    // To react when input changes, we can subscribe to changes or use Angular's input effects.
    // Let's use simple query loading and also handle changes.
    // To make sure it reacts, we can listen to the inputs. We can do that by using a simple effect
    // in constructor or by loading inside ngOnChanges or using Angular Signals reactivity!
    // Since category() is a signal, we can fetch products reactively using an effect,
    // or just trigger load whenever category changes. Let's write a simple method to fetch:
    this.fetchProducts();
  }

  // To react when category input changes (e.g. navigation from one details page to another),
  // we can use ngOnChanges or a simple watcher. Let's implement ngOnChanges:
  ngOnChanges(): void {
    this.fetchProducts();
  }

  private fetchProducts(): void {
    const cat = this.category();
    if (!cat) return;

    this.isLoading.set(true);
    this.productService.getProductsByCategory(cat).subscribe({
      next: (products) => {
        this.relatedProductsList.set(products);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching related products', err);
        this.isLoading.set(false);
      }
    });
  }
}
