export interface Sale {
  id: string;
  transactionId: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  items: SaleItem[];
  totalAmount: number;
  tax: number;
  discount: number;
  paymentMethod: 'cash' | 'card' | 'mobile' | 'credit';
  status: 'completed' | 'pending' | 'refunded' | 'cancelled';
  cashier: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
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

export interface SalesFilter {
  period: 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  cashier?: string;
  paymentMethod?: string;
}