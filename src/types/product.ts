export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  cover?: string; // Optional cover image for 750ml products
  sizes: ProductSize[];
}

export interface ProductSize {
  size: string;
  price: number;
  mrp?: number;
}
