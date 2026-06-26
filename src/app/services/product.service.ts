import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private jsonUrl = '/assets/products.json';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all products from mock JSON with a simulated network delay
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.jsonUrl).pipe(
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
}
