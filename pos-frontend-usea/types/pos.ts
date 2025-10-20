import { Cashier } from "./cashier";
import { Customer } from "./customer";
import { Product } from "./product";


// types/pos.ts
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
}

export interface PaymentInfo {
  method: 'card' | 'cash' | 'mobile' | 'credit';
  amount: number;
  change?: number;
  reference?: string;
}

export interface POSState {
  cart: CartItem[];
  customer: Customer | null;
  cashier: Cashier | null;
  payment: PaymentInfo | null;
  discount: number;
  tax: number;
}