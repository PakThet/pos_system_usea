export type EmployeeStatus = 'active' | 'inactive' | 'on-break';
export type EmployeeRole = 'admin' | 'manager' | 'cashier' | 'senior-cashier' | 'head-cashier';
export type EmployeeShift = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Employee {
  id: string;
  store_id?: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: EmployeeStatus;
  role: EmployeeRole;
  shift: EmployeeShift;
  hourly_rate: number;
  total_hours: number;
  total_sales: number;
  total_transactions: number;
  permissions: string[];
  last_login_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface EmployeeStats {
  total: number;
  active: number;
  onBreak: number;
  totalSales: number;
  totalTransactions: number;
  averageTransaction: number;
}

export interface CreateEmployeeData {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: EmployeeStatus;
  role: EmployeeRole;
  shift: EmployeeShift;
  hourly_rate: number;
  permissions: string[];
  store_id?: string;
}