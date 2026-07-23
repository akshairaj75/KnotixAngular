import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  private mapToProduct(dto: any): Product {
    let imageUrl = dto.images && dto.images.length > 0 ? dto.images[0].imageUrl : '';
    if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      const apiPrefix = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
      const pathSuffix = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
      imageUrl = `${apiPrefix}/${pathSuffix}`;
    }
    return {
      id: dto.id,
      name: dto.name,
      category: dto.categoryName || 'Unknown',
      categoryId: dto.categoryId,
      price: dto.basePrice,
      description: dto.description || dto.shortDescription || '',
      image: imageUrl,
      rating: 4.5, // Default mock rating
      stock: dto.variants && dto.variants.length > 0
        ? dto.variants.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0)
        : 0
    };
  }

  /**
   * Fetch all products from Spring Boot API
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-products`).pipe(
      map((dtos: any[]) => dtos.map(dto => this.mapToProduct(dto)))
    );
  }

  /**
   * Fetch a single product by its ID from Spring Boot API
   */
  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<any>(`${this.apiUrl}/view-product/${id}`).pipe(
      map(dto => this.mapToProduct(dto))
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
   * Create a new product in Spring Boot API
   */
  createProduct(productData: any, imageFile?: File): Observable<Product> {
    const formData = new FormData();
    const payload = {
      name: productData.name,
      categoryId: Number(productData.category), // Category ID from registration form
      basePrice: productData.price,
      description: productData.description,
      stock: productData.stock,
      status: 'ACTIVE'
    };

    formData.append('product', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post<any>(`${this.apiUrl}/add-products`, formData).pipe(
      map(dto => this.mapToProduct(dto))
    );
  }

  /**
   * Update an existing product in Spring Boot API
   */
  updateProduct(productId: number, productData: any, imageFile?: File): Observable<Product> {
    const formData = new FormData();
    const payload = {
      name: productData.name,
      categoryId: Number(productData.category), // Category ID from registration/edit form
      basePrice: productData.price,
      description: productData.description,
      stock: productData.stock,
      status: 'ACTIVE'
    };

    formData.append('product', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.put<any>(`${this.apiUrl}/update-product/${productId}`, formData).pipe(
      map(dto => this.mapToProduct(dto))
    );
  }

  /**
   * Fetch categories list from Spring Boot API
   */
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/category/get-categories`);
  }
}
