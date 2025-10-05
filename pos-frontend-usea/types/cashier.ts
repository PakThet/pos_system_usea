export interface Cashier {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'on-break';
  role: 'cashier' | 'senior-cashier' | 'head-cashier';
  shift: 'morning' | 'afternoon' | 'evening' | 'night';
  hourlyRate: number;
  totalHours: number;
  totalSales: number;
  totalTransactions: number;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  permissions: string[];
  notes?: string;
}

export interface CashierStats {
  total: number;
  active: number;
  onBreak: number;
  totalSales: number;
  totalTransactions: number;
  averageTransaction: number;
}

export interface CreateCashierData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'cashier' | 'senior-cashier' | 'head-cashier';
  shift: 'morning' | 'afternoon' | 'evening' | 'night';
  hourlyRate: number;
  permissions: string[];
}

export type CashierStatus = Cashier['status'];
export type CashierRole = Cashier['role'];
export type CashierShift = Cashier['shift'];