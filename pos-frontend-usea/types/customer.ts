export interface CustomerAddress {
  id?: number;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_primary?: boolean;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  tier: 'standard' | 'premium' | 'vip';
  avatar?: string | null;
  total_orders: number;
  total_spent: string;
  last_order?: string;
  created_at: string;
  updated_at: string;
  addresses?: CustomerAddress[];
}

export interface CreateCustomerData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  tier: 'standard' | 'premium' | 'vip';
  addresses?: Omit<CustomerAddress, 'id' | 'is_primary'>;
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {}

export interface CustomersResponse {
  data: Customer[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CustomerFilters {
  page?: number;
  perPage?: number;
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  tier?: 'all' | 'standard' | 'premium' | 'vip';
}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  new_this_month: number;
  vip: number;
  premium: number;
  standard: number;
  average_order_value: number;
}