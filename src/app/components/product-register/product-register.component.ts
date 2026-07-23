import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  isEditMode = signal<boolean>(false);
  productId = signal<number | null>(null);

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Categories list populated dynamically
  categories = signal<{id: number, name: string}[]>([]);

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: ['', []],
      stock: [0, [Validators.required, Validators.min(0)]]
    });

    this.loadCategories();
    this.checkEditMode();
  }

  private checkEditMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.isEditMode.set(true);
        this.productId.set(id);
        this.loadProductForEdit(id);
      }
    }
  }

  private loadProductForEdit(id: number): void {
    this.isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.isLoading.set(false);
        if (prod) {
          this.productForm.patchValue({
            name: prod.name,
            category: prod.categoryId || '',
            price: prod.price,
            description: prod.description,
            image: prod.image,
            stock: prod.stock
          });
        } else {
          this.errorMessage.set('Product not found.');
        }
      },
      error: (err) => {
        console.error('Error fetching product for edit', err);
        this.errorMessage.set('Failed to load product details.');
        this.isLoading.set(false);
      }
    });
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.errorMessage.set('Failed to load categories. Please check your connection.');
      }
    });
  }

  // Getter for easy form control checking in HTML
  get f() {
    return this.productForm.controls;
  }

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.productForm.patchValue({ image: file.name });
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.imagePreview = null;
      this.productForm.patchValue({ image: '' });
    }
  }

  onSubmit(): void {
    if (!this.isEditMode() && !this.selectedFile) {
      this.productForm.controls['image'].setErrors({ required: true });
    }

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formData = this.productForm.value;

    if (this.isEditMode()) {
      const id = this.productId();
      if (id !== null) {
        this.productService.updateProduct(id, formData, this.selectedFile || undefined).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.submitSuccess.set(true);
            
            // Wait 1.5s so that the premium success notification is fully visible to the user
            setTimeout(() => {
              this.router.navigate(['/products', id]);
            }, 1500);
          },
          error: (err) => {
            console.error('Error updating product', err);
            this.errorMessage.set('Failed to update the product. Please check the network connectivity.');
            this.isLoading.set(false);
          }
        });
      }
    } else {
      this.productService.createProduct(formData, this.selectedFile || undefined).subscribe({
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
}
