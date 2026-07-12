export interface Product {
  id: number;
  name: string;
  category: string;
  categoryId?: number;
  price: number;
  description: string;
  image: string;
  rating: number;
  stock: number;
}
