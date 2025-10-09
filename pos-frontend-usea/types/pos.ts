export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku: string;
  barcode: string;
  category: string;
  stock: number;
  minStock: number;
  image?: string;
  taxRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  loyaltyPoints: number;
}

export interface PaymentMethod {
  id: string;
  type: 'cash' | 'card' | 'mobile' | 'credit';
  name: string;
  icon: string;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  customer?: Customer;
  cashier: {
    id: string;
    name: string;
  };
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  createdAt: Date;
  notes?: string;
}
