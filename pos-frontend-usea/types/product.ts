import { Category } from "./category";

export interface Store {
  id: number;
  name: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
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
  image: string;
  category: Category;
  store: Store;
  created_at?: string;
  updated_at?: string;
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
  image: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductsResponse {
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ProductFilters {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  category_id?: number;
  store_id?: number;
}