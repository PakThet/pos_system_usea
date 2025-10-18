export interface Product {
  id: string;
  image?: string;
  store_id: string;
  category_id: string;
  p_name: string;
  description?: string;
  sku: string;
  slug: string;
  barcode: string;
  price: number;
  tax: number;
  quantity: number;
  discount: number;
  quantity_alert: number;
  created_at: string;
  updated_at: string;
  store?: Store;
  category?: Category;
}

export interface CreateProductData {
  image?: string;
  store_id: string;
  category_id: string;
  p_name: string;
  description?: string;
  sku: string;
  slug: string;
  barcode: string;
  price: number;
  tax: number;
  quantity: number;
  discount: number;
  quantity_alert: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  desc?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
}