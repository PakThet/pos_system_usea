export interface Cashier {
  id: string;
  avatar?: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'on-break';
  role: 'cashier' | 'senior-cashier' | 'head-cashier';
  shift: 'morning' | 'afternoon' | 'evening' | 'night';
  hourly_rate: number;
  total_hours: number;
  total_sales: number;
  total_transactions: number;
  last_login_at?: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateCashierData {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'on-break';
  role: 'cashier' | 'senior-cashier' | 'head-cashier';
  shift: 'morning' | 'afternoon' | 'evening' | 'night';
  hourly_rate: number;
  permissions?: string[];
}

export interface CashierStats {
  total: number;
  active: number;
  onBreak: number;
  totalSales: number;
  totalTransactions: number;
  averageTransaction: number;
}