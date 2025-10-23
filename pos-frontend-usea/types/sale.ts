export interface Sale {
  id: number;
  transaction_id: string;
  store_id: number;
  customer_id?: number;
  cashier_id: number;
  subtotal_amount: string;
  tax_amount: string;
  discount_amount: string;
  total_amount: string;
  payment_method: 'card' | 'cash' | 'mobile' | 'credit';
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
  store: {
    id: number;
    name: string;
    location: string;
  };
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  cashier: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  items: SaleItem[];
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  product_name: string;
  sku: string;
  category_name: string;
  quantity: number;
  unit_price: string;
  tax_rate: string;
  discount_amount: string;
  total_price: string;
  product: {
    id: number;
    name: string;
    image?: string;
    price: string;
    cost_price: string;
  };
}

export interface SalesSummary {
  total_sales: number;
  total_revenue: number;
  total_tax: number;
  total_discount: number;
  average_sale_value: number;
  status_breakdown: {
    completed: number;
    pending: number;
    cancelled: number;
    refunded: number;
  };
  payment_method_breakdown: {
    card: number;
    cash: number;
    mobile: number;
    credit: number;
  };
}

export interface SalesTrend {
  date: string;
  sales: number;
  transactions: number;
  averageOrderValue: number;
}

export interface TopProduct {
  id: number;
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

export interface SalesFilter {
  period?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: string;
  page?: number;
  perPage?: number;
}