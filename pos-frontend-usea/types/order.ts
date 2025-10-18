import { Cashier } from "./cashier";
import { Customer, CustomerAddress } from "./customer";
import { Product } from "./product";

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  cashier_id?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  total_amount: number;
  tracking_number?: string;
  estimated_delivery?: string;
  shipping_address_id: string;
  billing_address_id: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  cashier?: Cashier;
  items?: OrderItem[];
  shipping_address?: CustomerAddress;
  billing_address?: CustomerAddress;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface CreateOrderData {
  order_number: string;
  customer_id: string;
  cashier_id?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  total_amount: number;
  tracking_number?: string;
  estimated_delivery?: string;
  shipping_address_id: string;
  billing_address_id: string;
  items: Array<{
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
  }>;
}

export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}