import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-register.component.html',
  styleUrl: './product-register.component.css'
})
export class ProductRegisterComponent implements OnInit {
  productForm!: FormGroup;
  isLoading = signal<boolean>(false);
  submitSuccess = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Categories list corresponding to mock items
  categories = ['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Watches'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: ['', [
        Validators.required,
        Validators.pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/)
      ]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Getter for easy form control checking in HTML
  get f() {
    return this.productForm.controls;
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formData = this.productForm.value;

    this.productService.createProduct(formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.submitSuccess.set(true);
        
        // Wait 1.5s so that the premium success notification is fully visible to the user
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error creating product', err);
        this.errorMessage.set('Failed to register the product. Please check the network connectivity.');
        this.isLoading.set(false);
      }
    });
  }
}
