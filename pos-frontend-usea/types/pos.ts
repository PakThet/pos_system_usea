// types/pos.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  tax_rate: string;
  quantity: number;
  sku: string;
  image?: string;
  category: {
    name: string;
  };
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  tier: 'standard' | 'premium' | 'vip';
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  total: number;
}

export interface SaleItemRequest {
  product_id: number;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  discount_amount: number;
}

export interface SaleRequest {
  customer_id: number | null;
  cashier_id: number | undefined;
  payment_method: string;
  items: SaleItemRequest[];
  subtotal_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
}

export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'credit';