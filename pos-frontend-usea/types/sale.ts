import { Cashier } from "./cashier";
import { Customer } from "./customer";
import { Product } from "./product";

export interface Sale {
  id: string;
  transaction_id: string;
  customer_id?: string;
  cashier_id: string;
  total_amount: number;
  tax: number;
  discount: number;
  payment_method: 'card' | 'cash' | 'mobile' | 'credit';
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  created_at: string;
  updated_at: string;
  customer?: Customer;
  cashier?: Cashier;
  items?: SaleItem[];
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  sku: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface CreateSaleData {
  transaction_id: string;
  customer_id?: string;
  cashier_id: string;
  total_amount: number;
  tax: number;
  discount: number;
  payment_method: 'card' | 'cash' | 'mobile' | 'credit';
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  items: Array<{
    product_id: string;
    product_name: string;
    sku: string;
    category: string;
    quantity: number;
    unit_price: number;
  }>;
}

export interface SalesSummary {
  totalSales: number;
  totalTransactions: number;
  averageOrderValue: number;
  taxCollected: number;
  discountGiven: number;
  netSales: number;
}

export interface SalesTrend {
  date: string;
  sales: number;
  transactions: number;
  averageOrderValue: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  quantity: number;
  revenue: number;
  growth: number;
}

export interface PaymentMethodStats {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}