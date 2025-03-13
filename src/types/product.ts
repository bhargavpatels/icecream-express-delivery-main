
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  sizes: ProductSize[];
}

export interface ProductSize {
  size: string;
  price: number;
  mrp?: number;
}
