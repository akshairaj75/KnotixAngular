import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product';
import { BUSINESS_CONTACT } from '../../constants/business-contact';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  product = input.required<Product>();

  getWhatsAppOrderLink(): string {
    const baseUrl = window.location.origin;
    const productUrl = `${baseUrl}/products/${this.product().id}`;
    let imageLink = this.product().image;
    if (imageLink && !imageLink.startsWith('http://') && !imageLink.startsWith('https://')) {
      const separator = imageLink.startsWith('/') ? '' : '/';
      imageLink = `${baseUrl}${separator}${imageLink}`;
    }
    const imageText = imageLink ? `\nImage Link: ${imageLink}` : '';
    const text = `Hello Knotix Crafts, I would like to order the product: "${this.product().name}" (Price: $${this.product().price}).\nProduct Details: ${productUrl}${imageText}\n\nPlease let me know how to proceed. Thank you!`;
    return `https://wa.me/${BUSINESS_CONTACT.phoneRaw.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  }
}
