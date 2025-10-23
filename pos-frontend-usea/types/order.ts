import { Product } from "./product";

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  tier: string;
  total_orders: number;
  total_spent: string;
}

export interface Store {
  id: number;
  name: string;
  location: string;
  phone: string;
}

export interface Cashier {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  employee_id: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}



export interface OrderItem {
  id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: string;
  total_price: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal_amount: string;
  tax_amount: string;
  shipping_amount: string;
  discount_amount: string;
  total_amount: string;
  customer: Customer;
  store: Store;
  cashier: Cashier;
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
  tracking_number?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  total_revenue: number;
  totalTax: number;
  average_order_value: number;
}

export interface OrderFilters {
  page?: number;
  perPage?: number;
  search?: string;
  status?: OrderStatus | 'all';
  payment_status?: PaymentStatus | 'all';
  customer_id?: number;
  store_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Order[];
    last_page: number;
    total: number;
    per_page: number;
  };
}
