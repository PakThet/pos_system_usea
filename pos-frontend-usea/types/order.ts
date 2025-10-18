export interface Store {
  id: number;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
  status: string;
  tier: string;
  total_orders: number;
  total_spent: string;
  last_order_at: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Cashier {
  id: number;
  store_id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
  status: string;
  role: string;
  shift: string;
  hourly_rate: string;
  total_hours: number;
  total_sales: string;
  total_transactions: number;
  last_login_at: string;
  permissions: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: number;
  customer_id: number;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  type: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: string;
  quantity: number;
  total_price: string;
  created_at: string;
  updated_at: string;
  product: {
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
  };
}

export interface Order {
  id: number;
  order_number: string;
  store_id: number;
  customer_id: number;
  cashier_id: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal_amount: string;
  tax_amount: string;
  shipping_amount: string;
  discount_amount: string;
  total_amount: string;
  tracking_number: string | null;
  estimated_delivery: string | null;
  shipping_address_id: number;
  billing_address_id: number;
  created_at: string;
  updated_at: string;
  store: Store;
  customer: Customer;
  cashier: Cashier;
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
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

export type OrderStatus = Order['status'];
export type PaymentStatus = Order['payment_status'];