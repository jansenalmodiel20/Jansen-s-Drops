export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  videoUrl?: string;
  category: string;
  features: string[];
  beforeImage?: string;
  afterImage?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type Page = 'home' | 'product' | 'checkout' | 'profile' | 'admin';
