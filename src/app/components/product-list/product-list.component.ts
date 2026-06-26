import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  // Core signals
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  
  // Filter/Sort signals
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('All');
  sortBy = signal<string>('rating'); // Default: sort by rating

  // Computed list of categories extracted from active products list
  categories = computed(() => {
    const list = this.products().map(p => p.category);
    return ['All', ...Array.from(new Set(list))];
  });

  // Reactive computed filtered and sorted products
  filteredAndSortedProducts = computed(() => {
    let items = [...this.products()];

    // Search query filtering (checks name and description)
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      items = items.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    // Category filtering
    const category = this.selectedCategory();
    if (category && category !== 'All') {
      items = items.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Sorting application
    const sort = this.sortBy();
    if (sort === 'priceLow') {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === 'priceHigh') {
      items.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    }

    return items;
  });

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.errorMessage.set('Failed to load products. Please check the network connection.');
        this.isLoading.set(false);
      }
    });
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy.set(target.value);
  }
}
