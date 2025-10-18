export interface Store {
  id: number;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  image: string;
  store_id: number;
  category_id: number;
  name: string;
  description: string;
  sku: string;
  slug: string;
  barcode: string;
  price: string;
  tax_rate: string;
  status: string;
  quantity: number;
  discount: number;
  cost_price: string;
  quantity_alert: number;
  created_at: string;
  updated_at: string;
  store: Store;
  category: Category;
}

export interface CreateProductData {
  name: string;
  description: string;
  sku: string;
  slug: string;
  barcode: string;
  price: string;
  cost_price: string;
  tax_rate: string;
  quantity: number;
  quantity_alert: number;
  discount: number;
  status: 'active' | 'inactive';
  store_id: number;
  category_id: number;
  image?: string;
}