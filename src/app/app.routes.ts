import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent, title: 'Product Catalog' },
  { path: 'products/:id', component: ProductDetailsComponent, title: 'Product Details' },
  { path: '**', redirectTo: '' }
];

