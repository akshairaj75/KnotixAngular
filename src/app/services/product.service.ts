import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay, tap } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private jsonUrl = '/assets/products.json';
  
  // In-memory cache to support creating new products dynamically
  private productsCache: Product[] = [];

  constructor(private http: HttpClient) {}

  /**
   * Fetch all products from cache or mock JSON with a simulated network delay
   */
  getProducts(): Observable<Product[]> {
    if (this.productsCache.length > 0) {
      return of(this.productsCache).pipe(
        delay(600)
      );
    }
    
    return this.http.get<Product[]>(this.jsonUrl).pipe(
      tap((data: Product[]) => {
        this.productsCache = data;
      }),
      delay(600) // Simulated network delay to demonstrate loading spinner
    );
  }

  /**
   * Fetch a single product by its ID
   */
  getProductById(id: number): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map((products: Product[]) => products.find(p => p.id === id))
    );
  }

  /**
   * Fetch all products belonging to a specific category
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products: Product[]) => products.filter(p => p.category.toLowerCase() === category.toLowerCase()))
    );
  }

  /**
   * Mock POST API call: Create a new product and add it to our in-memory list
   */
  createProduct(productData: Omit<Product, 'id' | 'rating'>): Observable<Product> {
    // Generate new unique ID
    const nextId = this.productsCache.length > 0 
      ? Math.max(...this.productsCache.map(p => p.id)) + 1 
      : 1;

    const newProduct: Product = {
      ...productData,
      id: nextId,
      rating: 5.0 // Default rating for new products
    };

    // Update local cache
    this.productsCache.push(newProduct);

    // Return the newly created product after a simulated delay
    return of(newProduct).pipe(
      delay(800)
    );
  }
}
