import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductRegisterComponent } from './components/product-register/product-register.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: ProductListComponent, title: 'Product Catalog' },
  { path: 'products/:id', component: ProductDetailsComponent, title: 'Product Details' },
  { path: 'register', component: ProductRegisterComponent, title: 'Register Product', canActivate: [adminGuard] },
  { path: 'edit/:id', component: ProductRegisterComponent, title: 'Edit Product', canActivate: [adminGuard] },
  { path: 'privacy-policy', component: PrivacyPolicyComponent, title: 'Privacy Policy - Knotix Crafts' },
  { path: 'about', component: AboutUsComponent, title: 'About Us - Knotix Crafts' },
  { path: 'terms-conditions', component: TermsConditionsComponent, title: 'Terms & Conditions - Knotix Crafts' },
  { path: 'contact', component: ContactUsComponent, title: 'Contact Us - Knotix Crafts' },
  { path: '**', redirectTo: '' }
];

