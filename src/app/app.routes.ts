import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductRegisterComponent } from './components/product-register/product-register.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent, title: 'Product Catalog' },
  { path: 'products/:id', component: ProductDetailsComponent, title: 'Product Details' },
  { path: 'register', component: ProductRegisterComponent, title: 'Register Product' },
  { path: '**', redirectTo: '' }
];

